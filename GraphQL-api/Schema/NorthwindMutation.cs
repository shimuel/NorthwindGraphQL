
using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using GraphQL_api.Schema.Model;

namespace GraphQL_api.Schema
{
    public class NorthwindMutation : ObjectGraphType
    {
        public NorthwindMutation(IUnitOfWork uow)
        {
            //Customer
            Name = "CreateCustomerMutation";
            Field<CustomerType>(
            "createCustomer",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<CustomerInputType>> {Name = "customer"}
            ),
            resolve: context =>
            {
                var customer = context.GetArgument<Customer>("customer"); 
                 uow.GetRepositoryAsync<Customer>().AddAsync(customer);
                 uow.SaveChanges();
                 return  uow.GetRepositoryAsync<Customer>().SingleAsync(predicate: p=> p.CustomerId == customer.CustomerId);
            });

            //CustomerDemographic
            Field<CustomerDemographicType>(
            "createCustomerDemographic",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<CustomerDemographicTypeInputType>> {Name = "CustomerDemographicTypeInputType"}
            ),
            resolve: context =>
            {
                var customerDemo = context.GetArgument<CustomerDemographic>("customerDemographicTypeInputType");
                 uow.GetRepositoryAsync<CustomerDemographic>().AddAsync(customerDemo);
                 uow.SaveChanges();
                 return  customerDemo;
            });

            //CustomerCustomerDemo
            Field<CustomerCustomerDemoType>(
            "createCustomerCustomerDemo",
            arguments: new QueryArguments(
                new QueryArgument<NonNullGraphType<CustomerCustomerDemoTypeInputType>> {Name = "CustomerCustomerDemoTypeInputType"}
            ),
            resolve: context =>
            {
                var customercustomerDemo = context.GetArgument<CustomerCustomerDemo>("customerCustomerDemoTypeInputType");
                 uow.GetRepositoryAsync<CustomerCustomerDemo>().AddAsync(customercustomerDemo);
                 uow.SaveChanges();
                 return  customercustomerDemo;
            });
        }
    }
}