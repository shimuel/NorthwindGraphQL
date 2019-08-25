using Microsoft.EntityFrameworkCore;

namespace DBLayer.Entities
{
    public class UserDBContext : DbContext
    {

        public UserDBContext(DbContextOptions<UserDBContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
    }
}