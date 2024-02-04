import { unstable_getServerSession } from "next-auth";
import dbConnect from "../lib/dbConnect";
import Users from "../models/Users";
import FamilyTrees from "../models/FamilyTrees";
import TreeMembersB from "../models/TreeMembersB";
import { ObjectId } from "mongodb";
import Collabs from "../models/Collabs";
import Events from "../models/Events";
import WrittenStories from "../models/WrittenStories";
import AudioStories from "../models/AudioStories";

export async function getSessionProfileRelation(session, profileId) {
    await dbConnect();

    //self, owner, relativeWithPost, relative, none
    //relativeWithPost
    //if session is tagged in a tree where profile is tagged and canPost is true
    //sessionProfileRelation = "relativeWithPost"

    /*
    -> self - check if session id === profile id 
    -> owner - check if session id === owner
    -> get all trees of session
    -> relative
        - get all trees of profileId
        - separate trees into canPost true and canPost false
        --if one session tree is found in canPost true array
            - set relativeWithPost to true else false
        --if one session tree is found in canPost false array
            - set relative to true else false
    -> response struct: 
    {
        self: bool,
        owner: bool,
        relativeWithPost: bool,
        relative: bool,
        mutualCanPostTrees: [treeObject],
        mutualTrees: [treeObject],
    }
            */

    //let sessionProfileRelation = "none";
    let resData = {
        isSelf: false,
        isOwner: false,
        isRelativeWithPost: false,
        isRelative: false,
        mutualTrees: [],
        //mutualCanPostTreeMemberships: [],
        //mutualNoPostTreeMemberships: [],
        //profilePublicTrees: []
    };
    const profile = await Users.findById(profileId);

    if (session.user.id === profileId) {
        resData.isSelf = true;
    }

    if (session.user.id === profile?.owner) {
        resData.isOwner = true;
    }

    const sessionTreeMemberships = await TreeMembersB.find({
        taggedUser: ObjectId(session.user.id),
    }).select("treeId treeName canPost createdAt");
    const profileTreeMemberships = await TreeMembersB.find({
        taggedUser: profile._id,
    }).select("treeId treeName canPost createdAt");

    //split to can post and no post
    let profileCanPostTreeMembershipsId = [];
    let profileNoPostTreeMembershipsId = [];
    profileTreeMemberships.map((membership) => {
        if (membership.canPost) {
            profileCanPostTreeMembershipsId.push(membership.treeId);
        } else {
            profileNoPostTreeMembershipsId.push(membership.treeId);
        }
    });

    //get treeId array of sessionTreeMemberships
    const sessionMembershipsId = sessionTreeMemberships.map((m) => m.treeId);

    //check if profileCanPostTreeMemberships contain any item from sessionMembershipsId
    resData.isRelativeWithPost = sessionMembershipsId.some((item) =>
        profileCanPostTreeMembershipsId.includes(item)
    );
    //now for no post trees
    resData.isRelative = sessionMembershipsId.some((item) =>
        profileNoPostTreeMembershipsId.includes(item)
    );

    //set mutual trees
    if (!resData.isSelf) {
        const allProfileMemberships = profileCanPostTreeMembershipsId.concat(
            profileNoPostTreeMembershipsId
        );
        const mutualMembershipsId = sessionMembershipsId.map((id) => {
            if (allProfileMemberships.includes(id)) {
                return id;
            }
        });

        resData.mutualTrees = sessionTreeMemberships.filter((m) =>
            mutualMembershipsId.includes(m.treeId)
        );
    }
    return resData;
}

export async function getSessionProfileRelationUtil(session, profileId) {
    await dbConnect();

    let sessionProfileRelation = "none";
    const profile = await Users.findById(profileId);

    if (session.user.id === profileId) {
        sessionProfileRelation = "self";
    } else if (session.user.id === profile?.owner) {
        sessionProfileRelation = "owner";
    }
    //to-do: add relation based on mutual trees
    return sessionProfileRelation;
}

/**
 * function to check if session user is either 'owner', or 'member', or 'collaborator'
 * @param {*} session
 * @param {*} treeId
 * @param {*} mode the relationship to check for
 * @returns {string} 'owner','member', or 'collaborator'
 */
export async function getSessionTreeRelationUtil(session, treeId, mode) {
    await dbConnect();

    if (mode === "owner") {
        //familytree where owner = userId and _id = treeId
        const isOwner = await FamilyTrees.exists({
            _id: ObjectId(treeId),
            owner: session.user.id,
        });
        if (isOwner) return "owner";
    }

    if (mode === "member") {
        //get treemembersb where treeid = treeid and taggedUser = session.user.id
        const isMember = await TreeMembersB.exists({
            treeId: treeId,
            taggedUser: ObjectId(session.user.id),
        });
        if (isMember) return "member";
    }

    if (mode === "collaborator") {
        //get collabs where treeid = treeid and userId = session.user.id
        const isCollab = await Collabs.exists({
            treeId: treeId,
            userId: session.user.id,
        });
        if (isCollab) return "collaborator";
    }

    return "none";
}

export async function getSessionEventOrStoryRelation(
    session,
    eventOrStoryId,
    type
) {
    let relationship = {
        isSubject: false,
        isAuthor: false,
    };
    if (type === "event") {
        const eventDoc = await Events.findById(eventOrStoryId);
        if (eventDoc.userId.toString() === session.user.id) {
            relationship = { ...relationship, isSubject: true };
        }
        if (eventDoc.authorId.toString() === session.user.id) {
            relationship = { ...relationship, isAuthor: true };
        }
    }
    if (type === "written_story") {
        const storyDoc = await WrittenStories.findById(eventOrStoryId);
        if (storyDoc.userId.toString() === session.user.id) {
            relationship = { ...relationship, isSubject: true };
        }
        if (storyDoc.authorId.toString() === session.user.id) {
            relationship = { ...relationship, isAuthor: true };
        }
    }

    if (type === "audio_story") {
        const storyDoc = await AudioStories.findById(eventOrStoryId);
        if (storyDoc.userId.toString() === session.user.id) {
            relationship = { ...relationship, isSubject: true };
        }
        if (storyDoc.authorId.toString() === session.user.id) {
            relationship = { ...relationship, isAuthor: true };
        }
    }
    return relationship;
}
