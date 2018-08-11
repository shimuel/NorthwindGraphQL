using System.Collections.Generic;
using System.Threading.Tasks;
using GraphQL_api.Models;

namespace GraphQL_api.Db
{
    public interface IRepo<T>
    {
        Task<T> Get(int id);
        Task<List<T>> All();
        Task<T> Add(T o);
    }
}