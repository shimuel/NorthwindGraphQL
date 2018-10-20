using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;
using GraphQL_api.Db;
namespace GraphQL_api.Schema
{
    public class NorthwindQuery : ObjectGraphType
    {
         public NorthwindQuery(CustomerRepo customerRepository)
        {
            Field<CustomerType>(
                "customer",
                arguments: new QueryArguments(new QueryArgument<StringGraphType> { Name = "id" }),
                resolve: context =>  customerRepository.Get(context.GetArgument<string>("id")));
            
            Field<ListGraphType<CustomerType>>(
                "customers",
                resolve: context => customerRepository.All());
        }

    }
}