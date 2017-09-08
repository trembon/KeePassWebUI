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
    public interface IGroupHubClient
    {
        void groupAdded(KPGroup group);
    }

    public class GroupHub : Hub<IGroupHubClient>
    {
        public KPGroup GetRootNode()
        {
            return KeePassContext.Instance.Groups.FirstOrDefault(g => g.ParentID == null);
        }

        public List<KPGroup> GetChildren(string groupId)
        {
            return KeePassContext
                .Instance
                .Groups
                .Where(g => g.ParentID == groupId)
                .ToList();
        }

        public bool AddGroup(KPGroup group)
        {
            bool result = KeePassContext.Instance.AddGroup(group);

            if (result)
                Clients.All.groupAdded(group);

            return result;
        }
    }
}