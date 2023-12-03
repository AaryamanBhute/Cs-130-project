using Common;
using System.Text.Json.Serialization;
using DataAccess;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<Config>(builder.Configuration.GetSection(Config.SectionName));

builder.Services.AddSingleton<MemoryAccessor>();
builder.Services.AddSingleton<ChessStrategy>();
builder.Services.AddSingleton<YahtzeeStrategy>();
builder.Services.AddSingleton<MastermindStrategy>();

builder.Services.AddCors(o => o.AddPolicy(name: "Policy", builder =>
{
    builder.WithOrigins("http://localhost:3000")
           .AllowAnyMethod()
           .AllowAnyHeader();
}));

builder.Services.AddControllers().AddJsonOptions(opt => { opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()); });
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("Policy");
app.UseAuthorization();

app.MapControllers();

app.Run();
