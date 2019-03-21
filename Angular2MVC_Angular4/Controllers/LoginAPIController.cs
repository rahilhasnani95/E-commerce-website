using Angular2MVC.DBContext;
using Angular2MVC.Enum;
using Angular2MVC.Models;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace Angular2MVC.Controllers
{
    public class LoginAPIController : BaseAPIController
    {
        public static readonly string UserRole = "User";
        public static readonly string AdminRole = "Admin";
        public static readonly string CompanyTypeBuyer = "Buyer";
        public static readonly string CompanyTypeSupplier = "Supplier";
        public static readonly string UserPageUrl = "user";
        public static readonly string CompanyPageUrl = "company";
        public static readonly string ProductPageUrl = "product";

        public HttpResponseMessage Get()
        {
            return ToJson(UserDB.TblUsers.AsEnumerable());
        }

        public HttpResponseMessage Post(TblUser value)
        {

            var user = UserDB.TblUsers.Where(i => i.UserName.Equals(value.UserName, System.StringComparison.OrdinalIgnoreCase) && i.Password.Equals(value.Password, System.StringComparison.OrdinalIgnoreCase)).FirstOrDefault();
            var userDto = MapUserDetail(user);
            return ToJson(userDto);
        }

        public HttpResponseMessage Put(int id, [FromBody]TblUser value)
        {
            UserDB.Entry(value).State = EntityState.Modified;
            return ToJson(UserDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            UserDB.TblUsers.Remove(UserDB.TblUsers.FirstOrDefault(x => x.Id == id));
            return ToJson(UserDB.SaveChanges());
        }
        #region Private Helpers
        private UserInfoDto MapUserDetail(TblUser user)
        {
            UserInfoDto dto = null;
            if (user != null)
            {
                dto = new UserInfoDto
                {
                    Id = user.Id,
                    CompanyId = user.CompanyId,
                    FirstName = user.FirstName,
                    IsLocked = user.IsLocked,
                    Role = user.Role,
                    SecurityAnswer = user.SecurityAnswer,
                    UserName = user.UserName,
                    CompanyDetail = user.CompanyId.HasValue ? UserDB.TblCompanies.FirstOrDefault(o => o.Id == user.CompanyId) : null,

                };
                dto.UserRole = GetRole(dto);//assignig roles
                dto.URL = GetUrl(dto.UserRole);
            }
            return dto;

        }
        private Roles GetRole(UserInfoDto user)
        {
           
            if (user.Role.Equals(AdminRole) && !user.CompanyId.HasValue)
                return Roles.SuperAdmin;
            if (user.Role.Equals(AdminRole) && user.CompanyDetail.CompanyType.Equals(CompanyTypeBuyer))
                return Roles.BuyerAdmin;
            if (user.Role.Equals(AdminRole) && user.CompanyDetail.CompanyType.Equals(CompanyTypeSupplier))
                return Roles.SupplierAdmin;
            if (user.Role.Equals(UserRole) && user.CompanyDetail.CompanyType.Equals(CompanyTypeBuyer))
                return Roles.BuyerUser;
            if (user.Role.Equals(UserRole) && user.CompanyDetail.CompanyType.Equals(CompanyTypeSupplier))
                return Roles.SupplierUser;
            else
                return Roles.BuyerUser;


        }
        private string GetUrl(Roles role)
        {
            string Url = string.Empty; ;
            if (role.Equals(Roles.SuperAdmin) || role.Equals(Roles.BuyerAdmin) || role.Equals(Roles.SupplierAdmin))
                return UserPageUrl;
            else if (role.Equals(Roles.BuyerUser) || role.Equals(Roles.SupplierAdmin))
                return ProductPageUrl;

            return Url;

        }

        #endregion
    }
}