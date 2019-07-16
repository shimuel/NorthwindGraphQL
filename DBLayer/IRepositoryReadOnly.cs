using System;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Query;

namespace DBLayer
{
    public interface IRepositoryReadOnly<T> : IReadRepository<T> where T : class
    {

    }
}

