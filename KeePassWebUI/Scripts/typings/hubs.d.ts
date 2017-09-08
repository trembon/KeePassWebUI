// Get signalr.d.ts.ts from https://github.com/borisyankov/DefinitelyTyped (or delete the reference)
/// <reference path="signalr/signalr.d.ts" />
/// <reference path="jquery/jquery.d.ts" />

////////////////////
// available hubs //
////////////////////
//#region available hubs

interface SignalR {

    /**
      * The hub implemented by KeePassWebUI.Hubs.GroupHub
      */
    groupHub : GroupHub;

    /**
      * The hub implemented by KeePassWebUI.Hubs.EntryHub
      */
    entryHub : EntryHub;
}
//#endregion available hubs

///////////////////////
// Service Contracts //
///////////////////////
//#region service contracts

//#region GroupHub hub

interface GroupHub {
    
    /**
      * This property lets you send messages to the GroupHub hub.
      */
    server : GroupHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the GroupHub hub.
      */
    client : GroupHubClient;
}

interface GroupHubServer {

    /** 
      * Sends a "getRootNode" message to the GroupHub hub.
      * Contract Documentation: ---
      * @return {JQueryPromise of KPGroup}
      */
    getRootNode() : JQueryPromise<KPGroup>

    /** 
      * Sends a "getChildren" message to the GroupHub hub.
      * Contract Documentation: ---
      * @param groupId {string} 
      * @return {JQueryPromise of KPGroup[]}
      */
    getChildren(groupId : string) : JQueryPromise<KPGroup[]>

    /** 
      * Sends a "addGroup" message to the GroupHub hub.
      * Contract Documentation: ---
      * @param group {KPGroup} 
      * @return {JQueryPromise of boolean}
      */
    addGroup(group : KPGroup) : JQueryPromise<boolean>
}

interface GroupHubClient
{

    /**
      * Set this function with a "function(group : KPGroup){}" to receive the "groupAdded" message from the GroupHub hub.
      * Contract Documentation: ---
      * @param group {KPGroup} 
      * @return {void}
      */
    groupAdded : (group : KPGroup) => void;
}

//#endregion GroupHub hub


//#region EntryHub hub

interface EntryHub {
    
    /**
      * This property lets you send messages to the EntryHub hub.
      */
    server : EntryHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the EntryHub hub.
      */
    client : EntryHubClient;
}

interface EntryHubServer {

    /** 
      * Sends a "getEntries" message to the EntryHub hub.
      * Contract Documentation: ---
      * @param groupId {string} 
      * @return {JQueryPromise of KPEntry[]}
      */
    getEntries(groupId : string) : JQueryPromise<KPEntry[]>

    /** 
      * Sends a "addEntry" message to the EntryHub hub.
      * Contract Documentation: ---
      * @param entry {KPEntry} 
      * @return {JQueryPromise of boolean}
      */
    addEntry(entry : KPEntry) : JQueryPromise<boolean>
}

interface EntryHubClient
{

    /**
      * Set this function with a "function(entry : KPEntry){}" to receive the "entryAdded" message from the EntryHub hub.
      * Contract Documentation: ---
      * @param entry {KPEntry} 
      * @return {void}
      */
    entryAdded : (entry : KPEntry) => void;
}

//#endregion EntryHub hub

//#endregion service contracts



////////////////////
// Data Contracts //
////////////////////
//#region data contracts


/**
  * Data contract for KeePassWebUI.Models.KPEntry
  */
interface KPEntry {
	ID : string;
	GroupID : string;
	Name : string;
	Username : string;
	Url : string;
	Password : string;
}


/**
  * Data contract for KeePassWebUI.Models.KPGroup
  */
interface KPGroup {
	ID : string;
	ParentID : string;
	Name : string;
}

//#endregion data contracts

