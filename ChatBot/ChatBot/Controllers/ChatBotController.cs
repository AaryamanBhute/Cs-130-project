using Common;
using DataAccess;
using Microsoft.AspNetCore.Mvc;

namespace ChatBot.Controllers
{
    [ApiController]
    [Route("/[controller]")]
    public class ChatBotController : ControllerBase
    {
        private readonly ILogger<ChatBotController> _logger;
        private readonly MemoryAccessor _accessor;
        private readonly ChessStrategy _chessStrategy;
        private readonly YahtzeeStrategy _yahtzeeStrategy;
        private readonly MastermindStrategy _mastermindStrategy;

        public ChatBotController(ILogger<ChatBotController> logger, MemoryAccessor accessor,
            ChessStrategy chessStrategy, YahtzeeStrategy yahtzeeStrategy, MastermindStrategy mastermindStrategy)
        {
            _logger = logger;
            _accessor = accessor;
            _chessStrategy = chessStrategy;
            _yahtzeeStrategy = yahtzeeStrategy;
            _mastermindStrategy = mastermindStrategy;
        }

        [HttpPost(Name = "AskQuestion")]
        public async Task<JsonResult> Get([FromBody] QuestionRequest request)
        {
            GameType gameType = request.GameType;
            string question = request.Question;

            switch  (gameType)
            {
                case GameType.Chess: return new JsonResult(new { Result = await _accessor.AskQuestionAsync(question, _chessStrategy) });
                case GameType.Yahtzee: return new JsonResult(new { Result = await _accessor.AskQuestionAsync(question, _yahtzeeStrategy) });
                case GameType.Mastermind: return new JsonResult(new { Result = await _accessor.AskQuestionAsync(question, _mastermindStrategy) });
            }

            throw new InvalidOperationException();
        }

        public class QuestionRequest
        {
            public GameType GameType { get; set; }
            public string Question { get; set; }
        }
    }
}