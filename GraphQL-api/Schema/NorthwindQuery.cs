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
            //Customer
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

            //CustomerDemographic
            Field<CustomerDemographicType>(
                "CustomerDemographic",
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<CustomerDemographic>().SingleAsync(predicate: i=> i.CustomerTypeId == id,
                        include: q => q.Include(j => j.CustomerCustomerDemo)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<CustomerDemographicType>>(
                "CustomerDemographics",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<CustomerDemographic>().GetListAsync(
                        include: q => q.Include(j => j.CustomerCustomerDemo)
                     );                     
                     return tmp.Result.Items;
             });

            //CustomerCustomerDemo
            Field<CustomerCustomerDemoType>(
                "CustomerCustomerDemo",
                resolve: context => {
                    var id = context.GetArgument<string>("id");
                     var tmp = uow.GetRepositoryAsync<CustomerCustomerDemo>().SingleAsync(predicate: i=> i.CustomerTypeId == id,
                        include: q => q.Include(j => j.Customer).Include(k=>k.Customer)
                     );                     
                    return tmp;
            });

            Field<ListGraphType<CustomerCustomerDemoType>>(
                "CustomerCustomerDemos",
                resolve: context => {
                     var tmp = uow.GetRepositoryAsync<CustomerCustomerDemo>().GetListAsync(
                        include: q => q.Include(j => j.Customer).Include(k=>k.Customer)
                     );                     
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