using Angular2MVC.DBContext;
using Angular2MVC.Models;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Web.Http;

namespace Angular2MVC.Controllers
{
    public class ProductAPIController : BaseAPIController
    {
        public HttpResponseMessage Get()
        {
            return ToJson(MapProductDetail(UserDB.TblProducts).AsEnumerable());
        }

        public HttpResponseMessage Post([FromBody]TblProduct value)
        {
            UserDB.TblProducts.Add(value);
            return ToJson(UserDB.SaveChanges());
        }

        public HttpResponseMessage Put(int id, [FromBody]TblProduct value)
        {
            UserDB.Entry(value).State = EntityState.Modified;
            return ToJson(UserDB.SaveChanges());
        }
        public HttpResponseMessage Delete(int id)
        {
            UserDB.TblProducts.Remove(UserDB.TblProducts.FirstOrDefault(x => x.Id == id));
            return ToJson(UserDB.SaveChanges());
        }
        private List<ProductInfoDto> MapProductDetail(DbSet<TblProduct> products)
        {
            var productList = new List<ProductInfoDto>();
            foreach (var product in products)
            {
                var dto = new ProductInfoDto
                {
                    Id = product.Id,
                    CompanyId = product.CompanyId,
                    Description = product.Description,
                    Inventory = product.Inventory,
                    MaterialCode = product.MaterialCode,
                    Price = product.Price,
                    ImagePath = product.ImagePath,
                    CompanyName = UserDB.TblCompanies.FirstOrDefault(o => o.Id == product.CompanyId).Name,

                };
                productList.Add(dto);

            }

            return productList;

        }
    }
}
