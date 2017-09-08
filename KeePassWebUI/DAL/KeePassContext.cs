using KeePassLib;
using KeePassLib.Collections;
using KeePassLib.Keys;
using KeePassLib.Serialization;
using KeePassWebUI.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace KeePassWebUI.DAL
{
    public class KeePassContext
    {
        #region Singleton
        public static KeePassContext Instance { get; } = new KeePassContext();
        #endregion

        private static object databaseLock = new object();

        private KeePassContext()
        {
        }

        private DisposablePwDatabase Open()
        {
            string dbPath = ConfigurationManager.AppSettings["databasePath"];
            if (!File.Exists(dbPath))
                dbPath = HostingEnvironment.MapPath(dbPath);

            var ioConnInfo = new IOConnectionInfo { Path = dbPath };
            var compKey = new CompositeKey();

            if (!string.IsNullOrWhiteSpace(ConfigurationManager.AppSettings["databasePassword"]))
                compKey.AddUserKey(new KcpPassword(ConfigurationManager.AppSettings["databasePassword"]));

            string keyPath = ConfigurationManager.AppSettings["databaseKeyFile"];
            if (!string.IsNullOrWhiteSpace(keyPath))
            {
                if (!File.Exists(keyPath))
                    keyPath = HostingEnvironment.MapPath(keyPath);

                compKey.AddUserKey(new KcpKeyFile(keyPath));
            }

            PwDatabase database = new PwDatabase();
            database.Open(ioConnInfo, compKey, null);

            return new DisposablePwDatabase(database);
        }
        
        #region Groups
        private static List<PwGroup> groupCache;

        public List<KPGroup> Groups
        {
            get
            {
                if (groupCache == null)
                {
                    groupCache = GetGroups();
                }

                return groupCache
                    .Select(g => new KPGroup
                    {
                        ID = g.Uuid.ToHexString(),
                        ParentID = g.ParentGroup?.Uuid.ToHexString(),
                        Name = g.Name
                    })
                    .ToList();
            }
        }

        private PwGroup GetGroup(string id, PwDatabase database)
        {
            if (database.RootGroup.Uuid.ToHexString().Equals(id, StringComparison.OrdinalIgnoreCase))
            {
                return database.RootGroup;
            }
            else
            {
                return database.RootGroup.GetGroups(true).FirstOrDefault(g => g.Uuid.ToHexString().Equals(id, StringComparison.OrdinalIgnoreCase));
            }
        }

        private List<PwGroup> GetGroups()
        {
            lock (databaseLock)
            {
                using (var connection = Open())
                {
                    PwObjectList<PwGroup> groups = connection.Database.RootGroup.GetGroups(true);
                    if (groups == null)
                        groups = new PwObjectList<PwGroup>();

                    groups.Insert(0, connection.Database.RootGroup);

                    return groups.CloneDeep().ToList();
                }
            }
        }
        #endregion

        #region Groups write actions
        public bool AddGroup(KPGroup group)
        {
            lock (databaseLock)
            {
                using (var connection = Open())
                {
                    PwGroup parent = GetGroup(group.ParentID, connection.Database);
                    if (parent == null)
                        return false;

                    PwGroup newGroup = new PwGroup(true, true);
                    newGroup.Name = group.Name;
                    newGroup.EnableAutoType = false;
                    newGroup.EnableSearching = false;

                    parent.AddGroup(newGroup, true);
                    connection.Database.Save(null);

                    group.ID = newGroup.Uuid.ToHexString();

                    groupCache = null;

                    return true;
                }
            }
        }
        #endregion

        #region Entries
        private static List<PwEntry> entryCache;

        public List<KPEntry> Entries
        {
            get
            {
                if (entryCache == null)
                        entryCache = GetEntries();

                return entryCache
                    .Select(e => new KPEntry
                    {
                        ID = e.Uuid.ToHexString(),
                        GroupID = e.ParentGroup.Uuid.ToHexString(),
                        Name = e.Strings.GetSafe("Title").ReadString(),
                        Username = e.Strings.GetSafe("UserName").ReadString(),
                        Url = e.Strings.GetSafe("URL").ReadString(),
                        Password = e.Strings.GetSafe("Password").ReadString()
                    })
                    .ToList();
            }
        }

        private List<PwEntry> GetEntries()
        {
            lock (databaseLock)
            {
                using (var connection = Open())
                {
                    PwObjectList<PwEntry> entries = connection.Database.RootGroup.GetEntries(true);
                    if (entries == null)
                        entries = new PwObjectList<PwEntry>();

                    return entries.CloneDeep().ToList();
                }
            }
        }
        #endregion

        #region Entry write actions
        public bool AddEntry(KPEntry entry)
        {
            lock (databaseLock)
            {
                using (var connection = Open())
                {
                    PwGroup parent = GetGroup(entry.GroupID, connection.Database);
                    if (parent == null)
                        return false;

                    PwEntry newEntry = new PwEntry(true, true);
                    newEntry.Strings.Set("Title", new KeePassLib.Security.ProtectedString(false, entry.Name));
                    newEntry.Strings.Set("UserName", new KeePassLib.Security.ProtectedString(false, entry.Username));
                    newEntry.Strings.Set("Password", new KeePassLib.Security.ProtectedString(true, entry.Password));
                    newEntry.Strings.Set("URL", new KeePassLib.Security.ProtectedString(false, entry.Url));

                    parent.AddEntry(newEntry, false);
                    connection.Database.Save(null);

                    entry.ID = newEntry.Uuid.ToHexString();

                    entryCache = null;

                    return true;
                }
            }
        }
        #endregion
    }
}