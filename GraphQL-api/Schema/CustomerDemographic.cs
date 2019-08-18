using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema
{    
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