using Microsoft.KernelMemory;
using System.Reflection.Emit;

namespace DataAccess
{
    public class ChessStrategy : IMemoryStrategy
    {
        public async Task<MemoryAnswer> AskAsync(IKernelMemory memory, string question)
        {
            return await memory.AskAsync(question, filter: new MemoryFilter() { {"game", "Chess" } });
        }

        public async Task TrainOnDocumentAsync(IKernelMemory memory, string name)
        {
            await memory.ImportDocumentAsync(name, tags: new() { { "game", "Chess" } });
        }
    }

    public class YahtzeeStrategy : IMemoryStrategy
    {
        public async Task<MemoryAnswer> AskAsync(IKernelMemory memory, string question)
        {
            return await memory.AskAsync(question, filter: new MemoryFilter() { { "game", "Yahtzee" } });
        }

        public async Task TrainOnDocumentAsync(IKernelMemory memory, string name)
        {
            await memory.ImportDocumentAsync(name, tags: new() { { "game", "Yahtzee" } });
        }
    }

    public class MastermindStrategy : IMemoryStrategy
    {
        public async Task<MemoryAnswer> AskAsync(IKernelMemory memory, string question)
        {
            return await memory.AskAsync(question, filter: new MemoryFilter() { { "game", "Mastermind" } });
        }

        public async Task TrainOnDocumentAsync(IKernelMemory memory, string name)
        {
            await memory.ImportDocumentAsync(name, tags: new() { { "game", "Mastermind" } });
        }
    }
}
