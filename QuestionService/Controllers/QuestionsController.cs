using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestionService.Data;
using QuestionService.Models;
using QuestionService.DTOs;

namespace QuestionService.Controllers;

[ApiController]
[Route("[controller]")]
public class QuestionsController(QuestionDbContext db) : ControllerBase
{
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<Question>> CreateQuestion(CreateQuestionDto dto)
    {
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
        
        return Created($"questions/{question.Id}", question);
    }
}