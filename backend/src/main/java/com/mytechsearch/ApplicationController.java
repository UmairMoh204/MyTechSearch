package com.mytechsearch;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.sql.PreparedStatement;
import java.sql.Statement;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins="http://localhost:5173")
public class ApplicationController {
 private static final Set<String> STATUSES=Set.of("Applied","Interview","Offer","Rejected");
 private final JdbcTemplate db;
 public ApplicationController(JdbcTemplate db){this.db=db;}
 public record Entry(Long id,String company,String position,String status,String appliedDate,String notes){}
 public record Input(@NotBlank @Size(max=120) String company,@NotBlank @Size(max=160) String position,@NotBlank String status,@NotNull LocalDate appliedDate,@Size(max=2000) String notes){}
 private final RowMapper<Entry> mapper=(rs,n)->new Entry(rs.getLong("id"),rs.getString("company"),rs.getString("position"),rs.getString("status"),rs.getString("applied_date"),rs.getString("notes"));
 private void validate(Input input){if(!STATUSES.contains(input.status()))throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Invalid application status");}
 @GetMapping public List<Entry> all(){return db.query("SELECT * FROM applications ORDER BY id DESC",mapper);}
 @GetMapping("/{id}") public Entry one(@PathVariable long id){return db.query("SELECT * FROM applications WHERE id=?",mapper,id).stream().findFirst().orElseThrow(()->new ResponseStatusException(HttpStatus.NOT_FOUND,"Application not found"));}
 @PostMapping @ResponseStatus(HttpStatus.CREATED) public Entry create(@Valid @RequestBody Input input){
 validate(input);
 KeyHolder key=new GeneratedKeyHolder();
 db.update(connection->{PreparedStatement ps=connection.prepareStatement("INSERT INTO applications(company,position,status,applied_date,notes) VALUES(?,?,?,?,?)",Statement.RETURN_GENERATED_KEYS);ps.setString(1,input.company().trim());ps.setString(2,input.position().trim());ps.setString(3,input.status());ps.setString(4,input.appliedDate().toString());ps.setString(5,input.notes()==null?"":input.notes());return ps;},key);
 if(key.getKey()==null)throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,"Could not retrieve created application");
 return one(key.getKey().longValue());
 }
 @PutMapping("/{id}") public Entry update(@PathVariable long id,@Valid @RequestBody Input input){
 validate(input);
 if(db.update("UPDATE applications SET company=?,position=?,status=?,applied_date=?,notes=? WHERE id=?",input.company().trim(),input.position().trim(),input.status(),input.appliedDate().toString(),input.notes()==null?"":input.notes(),id)==0)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Application not found");
 return one(id);
 }
 @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) public void delete(@PathVariable long id){if(db.update("DELETE FROM applications WHERE id=?",id)==0)throw new ResponseStatusException(HttpStatus.NOT_FOUND,"Application not found");}
 @GetMapping("/stats") public Map<String,Object> stats(){return Map.of("total",db.queryForObject("SELECT COUNT(*) FROM applications",Integer.class),"interviews",db.queryForObject("SELECT COUNT(*) FROM applications WHERE status='Interview'",Integer.class),"offers",db.queryForObject("SELECT COUNT(*) FROM applications WHERE status='Offer'",Integer.class));}
}