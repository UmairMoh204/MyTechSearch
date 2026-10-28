package com.mytechsearch;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    static final Set<String> STATUSES = Set.of("Saved", "Applied", "Interview", "Offer", "Rejected");

    private final JdbcTemplate db;

    public ApplicationController(JdbcTemplate db) {
        this.db = db;
    }

    public record Entry(
            Long id,
            String company,
            String position,
            String status,
            String appliedDate,
            String notes) {}

    public record Input(
            @NotBlank @Size(max = 120) String company,
            @NotBlank @Size(max = 160) String position,
            @NotBlank String status,
            @NotNull LocalDate appliedDate,
            @Size(max = 2000) String notes) {}

    private final RowMapper<Entry> mapper = (rs, rowNum) -> new Entry(
            rs.getLong("id"),
            rs.getString("company"),
            rs.getString("position"),
            rs.getString("status"),
            rs.getString("applied_date"),
            rs.getString("notes"));

    @GetMapping
    public List<Entry> all() {
        return db.query("SELECT * FROM applications ORDER BY applied_date DESC, id DESC", mapper);
    }

    @GetMapping("/stats")
    public Map<String, Integer> stats() {
        Map<String, Integer> counts = new LinkedHashMap<>();
        counts.put("total", count("SELECT COUNT(*) FROM applications"));
        counts.put("saved", count("SELECT COUNT(*) FROM applications WHERE status = 'Saved'"));
        counts.put("applied", count("SELECT COUNT(*) FROM applications WHERE status = 'Applied'"));
        counts.put("interviews", count("SELECT COUNT(*) FROM applications WHERE status = 'Interview'"));
        counts.put("offers", count("SELECT COUNT(*) FROM applications WHERE status = 'Offer'"));
        counts.put("rejections", count("SELECT COUNT(*) FROM applications WHERE status = 'Rejected'"));
        return counts;
    }

    @GetMapping("/{id:\\d+}")
    public Entry one(@PathVariable long id) {
        return db.query("SELECT * FROM applications WHERE id = ?", mapper, id).stream()
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Entry create(@Valid @RequestBody Input input) {
        validate(input);
        KeyHolder key = new GeneratedKeyHolder();
        db.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    "INSERT INTO applications(company, position, status, applied_date, notes) VALUES(?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            bind(statement, input);
            return statement;
        }, key);
        Number generated = key.getKey();
        if (generated == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not retrieve created application");
        }
        return one(generated.longValue());
    }

    @PutMapping("/{id:\\d+}")
    public Entry update(@PathVariable long id, @Valid @RequestBody Input input) {
        validate(input);
        int updated = db.update(
                "UPDATE applications SET company = ?, position = ?, status = ?, applied_date = ?, notes = ? WHERE id = ?",
                input.company().trim(),
                input.position().trim(),
                input.status(),
                input.appliedDate().toString(),
                notes(input),
                id);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found");
        }
        return one(id);
    }

    @DeleteMapping("/{id:\\d+}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable long id) {
        if (db.update("DELETE FROM applications WHERE id = ?", id) == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found");
        }
    }

    private void validate(Input input) {
        if (!STATUSES.contains(input.status())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid application status");
        }
    }

    private void bind(PreparedStatement statement, Input input) throws java.sql.SQLException {
        statement.setString(1, input.company().trim());
        statement.setString(2, input.position().trim());
        statement.setString(3, input.status());
        statement.setString(4, input.appliedDate().toString());
        statement.setString(5, notes(input));
    }

    private String notes(Input input) {
        return input.notes() == null ? "" : input.notes().trim();
    }

    private int count(String sql) {
        Integer value = db.queryForObject(sql, Integer.class);
        return value == null ? 0 : value;
    }
}
