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

    public class GroupReaderHub : Hub<CatalogReaderClientContract>
    {
        public KPGroup GetRootNode()
        {
            using (var context = KeePassContext.Create())
            {
                return context.Groups.FirstOrDefault(g => g.ParentID == null);
            }
        }

        public List<KPGroup> GetChildren(string groupId)
        {
            using (var context = KeePassContext.Create())
            {
                return context
                    .Groups
                    .Where(g => g.ParentID == groupId)
                    .ToList();
            }
        }
    }
}