using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GraphQL_api.Models;

namespace GraphQL_api.Db
{
    public class CustomerRepo : IRepo<GraphQL_api.Models.Customer>
    {
         private readonly NorthwindbContext _db;

        public CustomerRepo(NorthwindbContext db)
        {
            _db = db;
        }
        
        public async  Task<GraphQL_api.Models.Customer> Get(string id){
            return await _db.Customers
            .Include(o => o.CustomerCustomerDemo).ThenInclude(c => c.CustomerType)
            .FirstOrDefaultAsync(p => p.CustomerId == id);
        }

        public async Task<List<GraphQL_api.Models.Customer>> All(){
            return await _db.Customers.Include(o => o.CustomerCustomerDemo)
                .ThenInclude(c => c.CustomerType)
            .ToListAsync();
        }

        public async Task<GraphQL_api.Models.Customer> Add(GraphQL_api.Models.Customer o){
            o = _db.Customers.AddAsync(o).Result.Entity;
            await _db.SaveChangesAsync();
            return o;
        }

        public async  Task<GraphQL_api.Models.Customer> Get(int id){
           throw new NotImplementedException();
        }
    }
}