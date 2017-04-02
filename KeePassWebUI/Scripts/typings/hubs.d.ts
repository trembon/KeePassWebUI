// Get signalr.d.ts.ts from https://github.com/borisyankov/DefinitelyTyped (or delete the reference)
/// <reference path="signalr/signalr.d.ts" />
/// <reference path="jquery/jquery.d.ts" />

////////////////////
// available hubs //
////////////////////
//#region available hubs

interface SignalR {

    /**
      * The hub implemented by KeePassWebUI.Hubs.GroupReaderHub
      */
    groupReaderHub : GroupReaderHub;

    /**
      * The hub implemented by KeePassWebUI.Hubs.EntryReaderHub
      */
    entryReaderHub : EntryReaderHub;
}
//#endregion available hubs

///////////////////////
// Service Contracts //
///////////////////////
//#region service contracts

//#region GroupReaderHub hub

interface GroupReaderHub {
    
    /**
      * This property lets you send messages to the GroupReaderHub hub.
      */
    server : GroupReaderHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the GroupReaderHub hub.
      */
    client : any;
}

interface GroupReaderHubServer {

    /** 
      * Sends a "getRootNode" message to the GroupReaderHub hub.
      * Contract Documentation: ---
      * @return {JQueryPromise of KPGroup}
      */
    getRootNode() : JQueryPromise<KPGroup>

    /** 
      * Sends a "getChildren" message to the GroupReaderHub hub.
      * Contract Documentation: ---
      * @param groupId {string} 
      * @return {JQueryPromise of KPGroup[]}
      */
    getChildren(groupId : string) : JQueryPromise<KPGroup[]>
}

//#endregion GroupReaderHub hub


//#region EntryReaderHub hub

interface EntryReaderHub {
    
    /**
      * This property lets you send messages to the EntryReaderHub hub.
      */
    server : EntryReaderHubServer;

    /**
      * The functions on this property should be replaced if you want to receive messages from the EntryReaderHub hub.
      */
    client : any;
}

interface EntryReaderHubServer {

    /** 
      * Sends a "getEntries" message to the EntryReaderHub hub.
      * Contract Documentation: ---
      * @param groupId {string} 
      * @return {JQueryPromise of KPEntry[]}
      */
    getEntries(groupId : string) : JQueryPromise<KPEntry[]>
}

//#endregion EntryReaderHub hub

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

