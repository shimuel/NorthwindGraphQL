using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Types;
using DBLayer;
using DBLayer.Entities;
using Microsoft.EntityFrameworkCore;

namespace GraphQL_api.Schema
{
    public class NorthwindQuery : ObjectGraphType
    {
        public NorthwindQuery(IUnitOfWork uow)
        {
            Field<CustomerType>(
                "customer",
                arguments: new QueryArguments(new QueryArgument<NonNullGraphType<StringGraphType>>{ Name = "id" }),
                resolve: context =>
                {         
                    var id = context.GetArgument<string>("id");
                    return uow.GetRepositoryAsync<Customer>().SingleAsync(predicate: i=> i.CustomerId == id,
                     include: q => q.Include(j => j.CustomerCustomerDemo).ThenInclude(k=>k.CustomerType));
                }
            );

            Field<ListGraphType<CustomerType>>(
                "customers",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<Customer>().GetListAsync(
                        include: q => q.Include(j => j.CustomerCustomerDemo).ThenInclude(k=>k.CustomerType));                     
                    return tmp.Result.Items;
            });
        }

    }
}

//Using predicates
//  var wherePredicate = PredicateBuilder.New<TreeDiagnosisXref>(false);
//             wherePredicate = wherePredicate.And(p => p.TreeSpecies.TreeHeightId == ht.TreeHeightId);
//             wherePredicate = wherePredicate.And(p => p.TreeSpecies.Type == tree.ParentId);
//             wherePredicate = wherePredicate.And(p => p.TreeSpecies.TreeSpeciesName.Equals(tree.Name));
//             if (!string.IsNullOrEmpty(id))
//             {
//                 symptomLocationId = int.Parse(id);              
//                 wherePredicate.And(p => p.Symptom.SymptomLocationId == symptomLocationId);
//             }


//             var diagRef = _UOW.GetReadOnlyRepository<TreeDiagnosisXref>().GetList(
//                 predicate: wherePredicate,
//                 include: q => q.Include(a=>a.Pest).Include(b=> b.TreeSpecies).Include(j => j.Symptom).ThenInclude(e => e.SymptomLocation)
//                 ).Items.Select(z => _mapper.Map<TreeDiagnosisXrefDTO>(z)); ;

//             Console.Write("");