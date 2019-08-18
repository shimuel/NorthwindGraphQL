using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;

namespace GraphQL_api.Schema.Model
{
    public class CategoryType : ObjectGraphType<Category>
    {
        public CategoryType()
        {
            Field(x => x.CategoryId,false);
            Field(x => x.CategoryName,true);
            Field(x => x.Description,true);            
            //Field(x => x.Picture,true);
            Field(x => x.Products,true, type: typeof(ListGraphType<ProductType>)).Description("Products");
        }
    }

    public class CategoryTypeInputType : InputObjectGraphType
    {
        public CategoryTypeInputType()
        {
                Name = "CategoryInput";
                Field<NonNullGraphType<IntGraphType>>("CategoryId");
                Field<NonNullGraphType<StringGraphType>>("CategoryName");
                Field<NonNullGraphType<StringGraphType>>("Description");
                //Field<StringGraphType>("Picture");
        }
    }    
}