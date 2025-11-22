using System.Security.Claims;
using Contracts;
using FastExpressionCompiler;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using QuestionService.Data;
using QuestionService.Models;
using QuestionService.DTOs;
using QuestionService.Services;
using Wolverine;

namespace QuestionService.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionsController(QuestionDbContext db, IMessageBus bus, TagService tagService) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Question>> CreateQuestion(CreateQuestionDto dto)
    {
        var validTags = await db.Tags.Where(x => dto.Tags.Contains(x.Slug)).ToListAsync();

        if (!await tagService.TagExistsAsync(dto.Tags))
            return BadRequest("Tag doesn't exist");

        var userid = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var userName = User.FindFirstValue("name");

        if (userid is null || userName is null) return BadRequest("Cannot get user details");

        var question = new Question
        {
            Title = dto.Title,
            Content = dto.Content,
            TagSlugs = dto.Tags,
            AskerId = userid,
            AskerDisplayName = userName
        };

        db.Questions.Add(question);
        await db.SaveChangesAsync();

        await bus.PublishAsync(new QuestionCreated(
            question.Id,
            question.Title,
            question.Content,
            question.CreatedAt,
            question.TagSlugs)
        );

        return Created($"questions/{question.Id}", question);
    }

    [HttpGet]
    public async Task<ActionResult<List<Question>>> GetQuestions(string? tag)
    {
        var query = db.Questions.AsQueryable();

        if (!string.IsNullOrEmpty(tag))
        {
            query = query.Where(x => x.TagSlugs.Contains(tag));
        }

        return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Question>> GetQuestion(string id)
    {
        var question = await db.Questions
            .Include(x=>x.Answers)
            .FirstOrDefaultAsync(x => x.Id == id);
        
        if (question is null) return NotFound();

        await db.Questions.Where(x => x.Id == question.Id)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.ViewCount,
                x => x.ViewCount + 1));

        return question;
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateQuestion(string id, CreateQuestionDto dto)
    {
        var question = await db.Questions.FindAsync(id);
        if (question is null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != question.AskerId) return Forbid();

        if (!await tagService.TagExistsAsync(dto.Tags))
            return BadRequest("Tag doesn't exist");

        question.Title = dto.Title;
        question.Content = dto.Content;
        question.TagSlugs = dto.Tags;
        question.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        await bus.PublishAsync(new QuestionUpdated(
            question.Id,
            question.Title,
            question.Content,
            question.TagSlugs.AsArray()));

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteQuestion(string id)
    {
        var question = await db.Questions.FindAsync(id);
        if (question is null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId != question.AskerId) return Forbid();

        db.Questions.Remove(question);
        await db.SaveChangesAsync();

        await bus.PublishAsync(new QuestionDeleted(question.Id));

        return NoContent();
    }

    [Authorize]
    [HttpPost("{questionId}/answers")]
    public async Task<ActionResult> PostAnswer(string questionId, CreateAnswerDto dto)
    {
        var question = await db.Questions.FindAsync(questionId);

        if (question is null) return NotFound();

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var name = User.FindFirstValue("name");

        if (userId is null || name is null) return BadRequest("Cannot get user details");
        var answer = new Answer
        {
            Content = dto.Content,
            UserId = userId,
            UserDisplayName = name,
            QuestionId = questionId
        };

        question.Answers.Add(answer);
        question.AnswerCount++;

        await db.SaveChangesAsync();

        await bus.PublishAsync(new AnswerCountUpdated(questionId, question.AnswerCount));

        return Created($"/questions/{questionId}", answer);
    }


    [Authorize]
    [HttpPut("{questionId}/answers/{answerId}")]
    public async Task<ActionResult> UpdateAnswer(string questionId, string answerId, CreateAnswerDto dto)
    {
        var answer = await db.Answers.FindAsync(answerId);
        if (answer is null) return NotFound();
        if (answer.QuestionId != questionId) return BadRequest("Cannot update answer details");

        answer.Content = dto.Content;
        answer.UpdatedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        return NoContent();
    }

    [Authorize]
    [HttpDelete("{questionId}/answers/{answerId}")]
    public async Task<ActionResult> DeleteAnswer(string questionId, string answerId)
    {
        var answer = await db.Answers.FindAsync(answerId);
        var question = await db.Questions.FindAsync(questionId);
        if (answer is null || question is null) return NotFound();
        if (answer.QuestionId != questionId || answer.Accepted) return BadRequest("Cannot delete the answer");
        
        db.Answers.Remove(answer);
        question.AnswerCount--;
        
        await db.SaveChangesAsync();
        
        await bus.PublishAsync(new AnswerCountUpdated(question.Id, question.AnswerCount));
        
        return NoContent();
    }
    
    [Authorize]
    [HttpPost("{questionId}/answers/{answerId}/accept")]
    public async Task<ActionResult> AcceptAnswer(string questionId, string answerId)
    {
        var answer = await db.Answers.FindAsync(answerId);
        var question = await db.Questions.FindAsync(questionId);
    
        if (answer is null || question is null) return NotFound();
        if (answer.QuestionId != questionId || question.HasAcceptedAnswer) 
            return BadRequest("Cannot accept answer");

        answer.Accepted = true;
        question.HasAcceptedAnswer = true;

        await db.SaveChangesAsync();
        
        await bus.PublishAsync(new AnswerAccepted(questionId));

        return NoContent();
    }

    [HttpGet("errors")]
    public ActionResult GetErrorResponses(int code)
    {
        ModelState.AddModelError("Problem one", "Validation problem one");
        ModelState.AddModelError("Problem two", "Validation problem two");
        
        return code switch
        {
            400 => BadRequest("Opposite of good request"),
            401 => Unauthorized(),
            403 => Forbid(),
            404 => NotFound(),
            500 => throw new Exception("this is a server error"),
            _ => ValidationProblem(ModelState)
        };
    }
}