
using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;
using GraphQL_api.Db;
namespace GraphQL_api.Schema
{
    public class NorthwindMutation : ObjectGraphType
    {
        public NorthwindMutation(Db.CustomerRepo customerRepository)
        {


            Name = "CreateCustomerMutation";

            Field<CustomerType>(
            "createCustomer",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<CustomerInputType>> {Name = "customer"}
            ),
            resolve: context =>
            {
                var customer = context.GetArgument<GraphQL_api.Models.Customer>("customer");
                return customerRepository.Get("ALFKI");
                //return customerRepository.Add(customer);  
            });
        }
    }
}