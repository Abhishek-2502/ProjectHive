package com.zosh.controller;

import java.util.List;

import com.zosh.response.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.zosh.DTO.IssueDTO;
import com.zosh.exception.IssueException;
import com.zosh.exception.ProjectException;
import com.zosh.exception.UserException;
import com.zosh.model.Issue;
import com.zosh.model.User;
import com.zosh.repository.MessageRepository;
import com.zosh.request.IssueRequest;
import com.zosh.response.MessageResponse;
import com.zosh.service.IssueService;
import com.zosh.service.UserService;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;
    
//    @GetMapping
//    public ResponseEntity<List<Issue>> getAllIssues() throws IssueException {
//        List<Issue> issues = issueService.getAllIssues();
//        return ResponseEntity.ok(issues);
//    }
    
    @GetMapping("/{issueId}")
    public ResponseEntity<Issue> getIssueById(@PathVariable Long issueId) throws IssueException {
        return ResponseEntity.ok(issueService.getIssueById(issueId).get());
                
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Issue>> getIssueByProjectId(@PathVariable Long projectId)
            throws ProjectException {
        return ResponseEntity.ok(issueService.getIssueByProjectId(projectId));

    }

    @PostMapping
    public ResponseEntity<IssueDTO> createIssue(@RequestBody IssueRequest issue, @RequestHeader("Authorization") String token) throws UserException, IssueException, ProjectException {
    	System.out.println("issue-----"+issue);
    	User tokenUser = userService.findUserProfileByJwt(token);
        User user = userService.findUserById(tokenUser.getId());

        if (user != null) {
 
            Issue createdIssue = issueService.createIssue(issue, tokenUser.getId());
            IssueDTO issueDTO=new IssueDTO();
            issueDTO.setDescription(createdIssue.getDescription());
            issueDTO.setDueDate(createdIssue.getDueDate());
            issueDTO.setId(createdIssue.getId());
            issueDTO.setPriority(createdIssue.getPriority());
            issueDTO.setProject(createdIssue.getProject());
            issueDTO.setProjectID(createdIssue.getProjectID());
            issueDTO.setStatus(createdIssue.getStatus());
            issueDTO.setTitle(createdIssue.getTitle());
            issueDTO.setTags(createdIssue.getTags());
            issueDTO.setAssignee(createdIssue.getAssignee());
            
            return ResponseEntity.ok(issueDTO);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{issueId}")
    public ResponseEntity<Issue> updateIssue(@PathVariable Long issueId, @RequestBody IssueRequest updatedIssue,
                                            @RequestHeader("Authorization") String token) throws IssueException, UserException, ProjectException {
    	User user = userService.findUserProfileByJwt(token);
    	System.out.println("user______>"+user);
        Issue updated = issueService.updateIssue(issueId,updatedIssue, user.getId()).get();

        return updated != null ?
                ResponseEntity.ok(updated) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{issueId}")
    public ResponseEntity<AuthResponse> deleteIssue(@PathVariable Long issueId, @RequestHeader("Authorization") String token) throws UserException, IssueException, ProjectException {
        User user = userService.findUserProfileByJwt(token);
        String deleted = issueService.deleteIssue(issueId, user.getId());

        AuthResponse res=new AuthResponse();
        res.setMessage("Issue deleted");
        res.setStatus(true);

        return ResponseEntity.ok(res);
               
    }

    
    @GetMapping("/search")
    public ResponseEntity<List<Issue>> searchIssues(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) Long assigneeId
    ) throws IssueException {
        // You can add more parameters as needed for your filtering criteria
        // Use the parameters to build a search query and call the service method

        List<Issue> filteredIssues = issueService.searchIssues(title, status, priority, assigneeId);

        return ResponseEntity.ok(filteredIssues);
    }


    @PutMapping ("/{issueId}/assignee/{userId}")
    public ResponseEntity<Issue> addUserToIssue(@PathVariable Long issueId, @PathVariable Long userId) throws UserException, IssueException {
       
            Issue issue = issueService.addUserToIssue(issueId, userId);

            return ResponseEntity.ok(issue);
        
    }

    @GetMapping("/assignee/{assigneeId}")
    public ResponseEntity<List<Issue>> getIssuesByAssigneeId(@PathVariable Long assigneeId) throws IssueException {
        List<Issue> issues = issueService.getIssuesByAssigneeId(assigneeId);
        return ResponseEntity.ok(issues);
    }

    @PutMapping("/{issueId}/status/{status}")
    public ResponseEntity<Issue>updateIssueStatus(
            @PathVariable String status,
            @PathVariable Long issueId) throws IssueException {
        Issue issue = issueService.updateStatus(issueId,status);
        return ResponseEntity.ok(issue);
    }


}

