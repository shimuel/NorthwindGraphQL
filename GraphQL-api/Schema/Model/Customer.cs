using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class CustomerType : ObjectGraphType<Customer>
    {
        public CustomerType()
        {
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
                Field<NonNullGraphType<IntGraphType>>("CustomerId");
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
}