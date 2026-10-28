package com.mytechsearch;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
@RestController @RequestMapping("/api/applications") @CrossOrigin(origins="http://localhost:5173")
public class ApplicationController {
 private final JdbcTemplate db;
 public ApplicationController(JdbcTemplate db){this.db=db;}
 public record Entry(Long id,String company,String position,String status,String appliedDate,String notes){}
 public record Input(@NotBlank String company,@NotBlank String position,@NotBlank String status,@NotNull LocalDate appliedDate,String notes){}
 private final org.springframework.jdbc.core.RowMapper<Entry> mapper=(rs,n)->new Entry(rs.getLong("id"),rs.getString("company"),rs.getString("position"),rs.getString("status"),rs.getString("applied_date"),rs.getString("notes"));
 @GetMapping public List<Entry> all(){return db.query("SELECT * FROM applications ORDER BY id DESC",mapper);}
 @GetMapping("/{id}") public Entry one(@PathVariable long id){return db.query("SELECT * FROM applications WHERE id=?",mapper,id).stream().findFirst().orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND));}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Entry create(@Valid @RequestBody Input input){
 db.update("INSERT INTO applications(company,position,status,applied_date,notes) VALUES(?,?,?,?,?)",input.company(),input.position(),input.status(),input.appliedDate().toString(),input.notes()==null?"":input.notes());
 Long id=db.queryForObject("SELECT last_insert_rowid()",Long.class);return one(id);
 }
 @PutMapping("/{id}") public Entry update(@PathVariable long id,@Valid @RequestBody Input input){
 if(db.update("UPDATE applications SET company=?,position=?,status=?,applied_date=?,notes=? WHERE id=?",input.company(),input.position(),input.status(),input.appliedDate().toString(),input.notes()==null?"":input.notes(),id)==0)throw new ResponseStatusException(HttpStatus.NOT_FOUND);
 return one(id);
 }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable long id){if(db.update("DELETE FROM applications WHERE id=?",id)==0)throw new ResponseStatusException(HttpStatus.NOT_FOUND);}
 @GetMapping("/stats") public Map<String,Object> stats(){return Map.of("total",db.queryForObject("SELECT COUNT(*) FROM applications",Integer.class),"interviews",db.queryForObject("SELECT COUNT(*) FROM applications WHERE status='Interview'",Integer.class),"offers",db.queryForObject("SELECT COUNT(*) FROM applications WHERE status='Offer'",Integer.class));}
}