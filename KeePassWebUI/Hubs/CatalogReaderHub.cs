using KeePassLib;
using KeePassWebUI.DAL;
using KeePassWebUI.Models;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KeePassWebUI.Hubs
{
    public interface CatalogReaderClientContract
    {
        void SomethingUpdated();
    }

    public class CatalogReaderHub : Hub<CatalogReaderClientContract>
    {
        public Catalog GetRootNode()
        {
            Catalog root = new Catalog();

            using (var context = new KeePassContext())
            {
                root.ID = context.GetRoot().Uuid.ToHexString();
                root.Name = context.GetRoot().Name;
            }

            return root;
        }

        public IEnumerable<Catalog> GetChildren(string catalogId)
        {
            PwGroup parent = null;
            using (var context = new KeePassContext())
            {
                if (context.GetRoot().Uuid.ToHexString() == catalogId)
                {
                    parent = context.GetRoot();
                }
                else
                {
                    parent = context
                        .GetRoot()
                        .GetFlatGroupList()
                        .FirstOrDefault(g => g.Uuid.ToHexString() == catalogId);
                }
            }

            if (parent == null)
                return new List<Catalog>();

            return parent
                .Groups
                .Select(g => new Catalog
                {
                    ID = g.Uuid.ToHexString(),
                    Name = g.Name
                });
        }
    }
}