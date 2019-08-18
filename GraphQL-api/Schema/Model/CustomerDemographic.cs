using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{       
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
                Field<NonNullGraphType<IntGraphType>>("CustomerTypeId");
                Field<NonNullGraphType<StringGraphType>>("CustomerDesc");
        }
    }
}