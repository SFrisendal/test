namespace Contracts;

public record QuestionUpdated(string QuestionId, string QuestionTitle, string QuestionContent, string[] Tags);