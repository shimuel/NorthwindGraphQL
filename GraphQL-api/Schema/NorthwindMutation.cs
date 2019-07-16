
using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
namespace GraphQL_api.Schema
{
    public class NorthwindMutation : ObjectGraphType
    {
        public NorthwindMutation(IUnitOfWork uow)
        {


            Name = "CreateCustomerMutation";

            Field<CustomerType>(
            "createCustomer",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<CustomerInputType>> {Name = "customer"}
            ),
            resolve: context =>
            {
                var customer = context.GetArgument<Customer>("customer");
                //return customerRepository.Get("ALFKI");
                //return customerRepository.Add(customer);  
                 uow.GetRepositoryAsync<Customer>().AddAsync(customer);
                 uow.SaveChanges();
                 return  uow.GetRepositoryAsync<Customer>().SingleAsync(predicate: p=> p.CustomerId == customer.CustomerId);
            });
        }
    }
}