using KeePassLib;
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
            root.ID = KeePassDatabase.Root.Uuid.ToHexString();
            root.Name = KeePassDatabase.Root.Name;

            return root;
        }

        public IEnumerable<Catalog> GetChildren(string catalogId)
        {
            PwGroup parent = null;
            if (KeePassDatabase.Root.Uuid.ToHexString() == catalogId)
            {
                parent = KeePassDatabase.Root;
            }
            else
            {
                parent = KeePassDatabase
                    .Root
                    .GetFlatGroupList()
                    .FirstOrDefault(g => g.Uuid.ToHexString() == catalogId);
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