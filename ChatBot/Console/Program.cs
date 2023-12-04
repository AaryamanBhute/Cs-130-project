// See https://aka.ms/new-console-template for more information
using Common;
using DataAccess;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

Console.WriteLine("Hello, World!");

var host = Host.CreateDefaultBuilder().ConfigureAppConfiguration((hostingContext, config) =>
{
    config.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables()
    .Build();
}).ConfigureServices((hostContext, services) =>
{
    services
    .Configure<Config>(hostContext.Configuration.GetSection(Config.SectionName))
    .AddTransient<MemoryAccessor>()
    .AddTransient<ChessStrategy>()
    .AddTransient<YahtzeeStrategy>()
    .AddTransient<MastermindStrategy>();

}).Build();

MemoryAccessor memory = host.Services.GetRequiredService<MemoryAccessor>();

Console.WriteLine(memory.TrainOnDocumentAsync("m1.pdf", host.Services.GetRequiredService<MastermindStrategy>()).Result);
Console.WriteLine(memory.TrainOnDocumentAsync("c1.pdf", host.Services.GetRequiredService<ChessStrategy>()).Result);
Console.WriteLine(memory.TrainOnDocumentAsync("y1.txt", host.Services.GetRequiredService<YahtzeeStrategy>()).Result);

Console.WriteLine("Training Complete");

Console.WriteLine("ASKING");

Console.WriteLine(memory.AskQuestionAsync("What is the best algorithm for mastermind?", host.Services.GetRequiredService<MastermindStrategy>()).Result);