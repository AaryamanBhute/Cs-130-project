using Microsoft.KernelMemory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess
{
    public interface IMemoryStrategy
    {
        public Task<MemoryAnswer> AskAsync(IKernelMemory memory, string question);
        public Task TrainOnDocumentAsync(IKernelMemory memory, string name);
    }
}
