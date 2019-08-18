using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
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
                Field<NonNullGraphType<IntGraphType>>("CustomerId");
                Field<NonNullGraphType<IntGraphType>>("CustomerTypeId");
        }
    }

}