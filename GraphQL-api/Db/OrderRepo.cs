using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using GraphQL_api.Models;

namespace GraphQL_api.Db
{
    public class OrderRepo : IRepo<GraphQL_api.Models.Order>
    {
         private readonly NorthwindbContext _db;

        public OrderRepo(NorthwindbContext db)
        {
            _db = db;
        }
        
        public async  Task<GraphQL_api.Models.Order> Get(int id){
            return await _db.Orders
            .Include(o => o.Customer).ThenInclude(c=>c.CustomerCustomerDemo)
            .FirstOrDefaultAsync(p => p.OrderId == id);
        }

        public async Task<List<GraphQL_api.Models.Order>> All(){
            return await _db.Orders.ToListAsync();
        }

        public async Task<GraphQL_api.Models.Order> Add(GraphQL_api.Models.Order o){
            await _db.Orders.AddAsync(o);
            await _db.SaveChangesAsync();
            return o;
        }

        public async  Task<GraphQL_api.Models.Order> Get(string id){
           throw new NotImplementedException();
        }

    }
}