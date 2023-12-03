using Microsoft.Extensions.Options;
using Common;
using Microsoft.KernelMemory.MemoryStorage.Qdrant;
using Microsoft.KernelMemory;

namespace DataAccess
{
    public class MemoryAccessor
    {
        Config _config;
        IKernelMemory _memory;

        public MemoryAccessor(IOptions<Config> config) {
            _config = config.Value;

            ArgumentException.ThrowIfNullOrEmpty(_config.QdrantEndpoint);
            Console.WriteLine(_config.QdrantEndpoint);

            var qdrantConfig = new QdrantConfig
            {
                Endpoint = _config.QdrantEndpoint,
                APIKey = Env.Var("QDRANT_KEY")
            };

            _memory = new KernelMemoryBuilder()
                .WithQdrant(qdrantConfig)
                .WithOpenAIDefaults(Env.Var("OPENAI_KEY"))
                .Build();
        }

        public async Task<string> AskQuestionAsync(string question, IMemoryStrategy strategy)
        {
            return (await strategy.AskAsync(_memory, question)).Result;
        }

        public async Task<bool> TrainOnDocumentAsync(string name, IMemoryStrategy strategy)
        {
            await strategy.TrainOnDocumentAsync(_memory, name);

            return true;
        }
    }
}