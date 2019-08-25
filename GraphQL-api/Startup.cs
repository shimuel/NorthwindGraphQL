using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.EntityFrameworkCore;

using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;

using GraphQL;
using GraphiQl;

using GraphQL.Types;
using DBLayer;
using GraphQL_api.DI;
using DBLayer.Entities;
using GraphQL_api.Schema;
using AutoMapper;

using GraphQL_api.Mappings;
using GraphQL_api.Auth;
using GraphQL_api.Auth.Services;

namespace GraphQL_api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            //Scaffold-DbContext "Server=(localdb)\mssqllocaldb;Database=Blogging;Trusted_Connection=True;" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models
            //dotnet ef dbcontext scaffold "Filename=Northwind.db" Microsoft.EntityFrameworkCore.Sqlite -o Models -f -c NorthwindbContext  (the Northwind.db should exist in same folder)
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();//.SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            // var mappingConfig = new MapperConfiguration(mc =>
            // {
            //     mc.AddProfile(new MappingProfile());
            // });

            var configuration = new MapperConfiguration(cfg => 
            {
                cfg.AddProfile<MappingProfile>();
            });
            // only during development, validate your mappings; remove it before release
            configuration.AssertConfigurationIsValid();
            // use DI (http://docs.automapper.org/en/latest/Dependency-injection.html) or create the mapper yourself
            var mapper = configuration.CreateMapper();
            services.AddSingleton(mapper);
            
            services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder => builder.WithOrigins("http://localhost:3000","http://localhost:8080")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials() 
                );
            });
            
            //Begining of User
            services.AddDbContext<UserDBContext>(
                opt => opt.UseInMemoryDatabase("GraphqlUsers")
            ).AddUnitOfWork<UserDBContext>();   

            //configure strongly typed settings objects
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
                        var userId = int.Parse(context.Principal.Identity.Name);
                        Console.Write("USER ID ????????????????????????????????????????????????????????"+userId);
                        var user = userService.GetById(userId);
                        if (user == null)
                        {
                            Console.Write("No User ????????????????????????????????????????????????????????");
                            // return unauthorized if user no longer exists
                            context.Fail("Unauthorized");
                        }
                        return Task.CompletedTask;
                    }
                };
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // configure DI for application services
            services.AddScoped<IUserService, UserService>();
            //End of User
        
            //Graphiql
            services.AddDbContext<NorthwindbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection"))
                ).AddUnitOfWork<NorthwindbContext>();                        
            
            var sp = services.BuildServiceProvider();
            services.AddSingleton<ISchema>(new NorthwindSchema(new FuncDependencyResolver(type => sp.GetService(type))));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            /* else
            {
                app.UseHsts();
            } */

            //app.UseHttpsRedirection();Only for MVC
            
            // app.UseDefaultFiles();
            // app.UseStaticFiles();
            // app.UseHttpsRedirection();
        // app.UseDefaultFiles();
        // app.UseStaticFiles();
        app.UseAuthentication();
        //app.UseJwtTokenMiddleware();
        //app.UseMvcWithDefaultRoute();
            app.UseCors("AllowSpecificOrigin");
            app.UseGraphiQl();
            app.UseMvc();
        }
    }
}
