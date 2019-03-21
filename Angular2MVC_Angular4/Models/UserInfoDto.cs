using Angular2MVC.DBContext;
using Angular2MVC.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Angular2MVC.Models
{
    public class UserInfoDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public Roles UserRole { get; set; }
        public string Role { get; set; }
        public string UserName { get; set; }
        public bool IsLocked { get; set; }
        public string SecurityAnswer { get; set; }
        public int? CompanyId { get; set; }
        public string URL { get; set; }
        public TblCompany CompanyDetail { get; set; }
    }
}