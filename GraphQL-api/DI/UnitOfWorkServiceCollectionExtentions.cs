using System;
using System.Collections.Generic;
using System.Text;

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using DBLayer;
using DBLayer.Impl;
using GraphQL.Types;
using GraphQL;
using GraphQL_api.Schema;

namespace GraphQL_api.DI
{
    public static class UnitOfWorkServiceCollectionExtentions
    {
        public static IServiceCollection AddUnitOfWork<TContext>(this IServiceCollection services)
            where TContext : DbContext
        {
            services.AddScoped<IRepositoryFactory, UnitOfWork<TContext>>();
            services.AddScoped<IUnitOfWork, UnitOfWork<TContext>>();
            services.AddScoped<IUnitOfWork<TContext>, UnitOfWork<TContext>>();
            
            services.AddTransient<IDocumentExecuter, DocumentExecuter>();
           
            services.AddSingleton<NorthwindQuery>();
            services.AddSingleton<NorthwindMutation>();
            
            services.AddSingleton<GraphQL_api.Schema.CustomerType>();
            services.AddSingleton<GraphQL_api.Schema.CustomerInputType>();
            
            services.AddSingleton<GraphQL_api.Schema.CustomerCustomerDemoType>();
            services.AddSingleton<GraphQL_api.Schema.CustomerCustomerDemoTypeInputType>();

            services.AddSingleton<GraphQL_api.Schema.CustomerDemographicType>();
            services.AddSingleton<GraphQL_api.Schema.CustomerDemographicTypeInputType>();

            return services;
        }

        //public static IServiceCollection AddUnitOfWork<TContext1, TContext2>(this IServiceCollection services)
        //    where TContext1 : DbContext
        //    where TContext2 : DbContext
        //{
        //    services.AddScoped<IUnitOfWork<TContext1>, UnitOfWork<TContext1>>();
        //    services.AddScoped<IUnitOfWork<TContext2>, UnitOfWork<TContext2>>();
        //    return services;
        //}

        //public static IServiceCollection AddUnitOfWork<TContext1, TContext2, TContext3>(
        //    this IServiceCollection services)
        //    where TContext1 : DbContext
        //    where TContext2 : DbContext
        //    where TContext3 : DbContext
        //{
        //    services.AddScoped<IUnitOfWork<TContext1>, UnitOfWork<TContext1>>();
        //    services.AddScoped<IUnitOfWork<TContext2>, UnitOfWork<TContext2>>();
        //    services.AddScoped<IUnitOfWork<TContext3>, UnitOfWork<TContext3>>();

        //    return services;
        //}

        //public static IServiceCollection AddUnitOfWork<TContext1, TContext2, TContext3, TContext4>(
        //    this IServiceCollection services)
        //    where TContext1 : DbContext
        //    where TContext2 : DbContext
        //    where TContext3 : DbContext
        //    where TContext4 : DbContext
        //{
        //    services.AddScoped<IUnitOfWork<TContext1>, UnitOfWork<TContext1>>();
        //    services.AddScoped<IUnitOfWork<TContext2>, UnitOfWork<TContext2>>();
        //    services.AddScoped<IUnitOfWork<TContext3>, UnitOfWork<TContext3>>();
        //    services.AddScoped<IUnitOfWork<TContext4>, UnitOfWork<TContext4>>();

        //    return services;
        //}
    }
}
