using System;
using System.Collections.Generic;
using System.Linq;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using AutoMapper;
using GraphQL_api.Auth;

namespace GraphQL_api.Schema.Model
{
    public class UserType : ObjectGraphType<UserDto>
    {
        public UserType()
        {
            Field(x => x.Id,false);
            Field(x => x.FirstName,true);
            Field(x => x.LastName,true);            
            Field(x => x.Username,true);
            Field(x => x.Password,true);
        }
    }

    public class UserInputType : InputObjectGraphType
    {
        public UserInputType()
        {
                Name = "UserInput";
                Field<IntGraphType>("Id");
                Field<StringGraphType>("FirstName");
                Field<StringGraphType>("LastName");
                Field<StringGraphType>("UserName");
                Field<StringGraphType>("Password");
        }
    }    
}