using System;
using System.Collections.Generic;
using System.Linq;
using DBLayer;
using DBLayer.Entities;

namespace GraphQL_api.Auth.Services
{
    public class UserService : IUserService
    {
        private IUnitOfWork<UserDBContext> _context;

        public UserService(IUnitOfWork<UserDBContext> uow)
        {
            _context = uow;
        }

        public User Authenticate(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
                return null;

            var user = _context.GetRepository<User>().Single(x => x.Username == username);

            // check if username exists
            if (user == null)
                return null;

            // check if password is correct
            if (!UserUtil.VerifyPasswordHash(password, user.PasswordHash, user.PasswordSalt))
                return null;

            // authentication successful
            return user;
        }

        public IEnumerable<User> GetAll()
        {
            return _context.GetRepository<User>().GetList().Items;
        }

        public User GetById(int id)
        {
            return _context.GetRepository<User>().GetList().Items.Single(usr => usr.Id == id);
        }

        public User Create(User user, string password)
        {
            // validation
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            if (_context.GetRepository<User>().GetList().Items.Any(x => x.Username == user.Username))
                throw new AppException("Username \"" + user.Username + "\" is already taken");

            byte[] passwordHash, passwordSalt;
            UserUtil.CreatePasswordHash(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            _context.GetRepository<User>().Add(user);
            _context.SaveChanges();

            return user;
        }

        public void Update(User userParam, string password = null)
        {
            var user = _context.GetRepository<User>().GetList().Items.Single(x => x.Id == userParam.Id);

            if (user == null)
                throw new AppException("User not found");

            if (userParam.Username != user.Username)
            {
                // username has changed so check if the new username is already taken
                if (_context.GetRepository<User>().GetList().Items.Any(x => x.Username == userParam.Username))
                    throw new AppException("Username " + userParam.Username + " is already taken");
            }

            // update user properties
            user.FirstName = userParam.FirstName;
            user.LastName = userParam.LastName;
            user.Username = userParam.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                UserUtil.CreatePasswordHash(password, out passwordHash, out passwordSalt);

                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
            }

            _context.GetRepository<User>().Update(user);
            _context.SaveChanges();
        }

        public void Delete(int id)
        {
            var user = _context.GetRepository<User>().GetList().Items.Single(x => x.Id == id);
            if (user != null)
            {
                _context.GetRepository<User>().Delete(user);
                _context.SaveChanges();
            }
        }

    }

    public interface IUserService
    {
        User Authenticate(string username, string password);
        IEnumerable<User> GetAll();
        User GetById(int id);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(int id);
    }

}