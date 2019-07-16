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
            Field(x => x.CustomerCustomerDemo,true, type: typeof(ListGraphType<CustomerCustomerDemoType>)).Description("Author's books");
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
    public class CustomerCustomerDemoType: ObjectGraphType <CustomerCustomerDemo> {  
        public CustomerCustomerDemoType() {
            Field(c => c.CustomerId);
            Field(c => c.CustomerTypeId);
            Field(c => c.CustomerType, false, type: typeof(CustomerDemographicType));
        }
    }

    public class CustomerCustomerDemoTypeInputType : InputObjectGraphType
    {
        public CustomerCustomerDemoTypeInputType()
        {
                Name = "CustomerCustomerDemoTypeInput";
                Field<NonNullGraphType<StringGraphType>>("CustomerId");
                Field<StringGraphType>("CustomerTypeId");
        }
    }

    public class CustomerDemographicType: ObjectGraphType <CustomerDemographic> {  
        public CustomerDemographicType() {
            Field(c => c.CustomerTypeId);
            Field(c => c.CustomerDesc);
            Field(c => c.CustomerCustomerDemo, false, type: typeof(ListGraphType<CustomerCustomerDemoType>));
        }
    }

    public class CustomerDemographicTypeInputType : InputObjectGraphType
    {
        public CustomerDemographicTypeInputType()
        {
                Name = "CustomerDemographicTypeInput";
                Field<NonNullGraphType<StringGraphType>>("CustomerTypeId");
                Field<StringGraphType>("CustomerDesc");
        }
    }
}