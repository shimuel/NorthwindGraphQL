using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema
{
    public class CustomerType : ObjectGraphType<Customer>
    {
        public CustomerType(IUnitOfWork uow)
        {
            //Field(x => x.CustomerId,type: typeof(IdGraphType)).Description("Customer's Id");
            Field(x => x.CustomerId,false);
            Field(x => x.CompanyName,true);
            Field(x => x.ContactName,true);            
            Field(x => x.ContactTitle,true);
            Field(x => x.Address,true);
            Field(x => x.City,true);
            Field(x => x.Country,true);
            Field(x => x.Region,true);
            Field(x => x.Fax,true);
            Field(x => x.Phone,true);
            Field(x => x.CustomerCustomerDemo,true, type: typeof(ListGraphType<CustomerCustomerDemoType>)).Description("Customer Demographics");
        }
    }

    public class CustomerInputType : InputObjectGraphType
    {
        public CustomerInputType()
        {
                Name = "CustomerInput";
                Field<NonNullGraphType<StringGraphType>>("CustomerId");
                Field<NonNullGraphType<StringGraphType>>("CompanyName");
                Field<StringGraphType>("ContactName");
                Field<StringGraphType>("ContactTitle");
                Field<StringGraphType>("Address");
                Field<StringGraphType>("City");
                Field<StringGraphType>("Country");
                Field<StringGraphType>("Region");
                Field<StringGraphType>("Fax");
                Field<StringGraphType>("Phone");
        }
    }    

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