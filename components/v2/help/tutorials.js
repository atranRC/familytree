import {
    Stepper,
    Button,
    Group,
    Box,
    Stack,
    Title,
    Text,
    Divider,
} from "@mantine/core";
import { Image } from "@mantine/core";

const FAM_IMG_URL =
    "https://img.freepik.com/free-vector/big-diverse-family-members-crowd-multicultural-people-different-ages-races-standing-together-cartoon-illustration_74855-14288.jpg?w=996&t=st=1690009826~exp=1690010426~hmac=1ebe6ab1b6aea5c3ba49b273cf59ff8aec8fa1c116a6da150cf49dfb6e63a351";
const WIKI_IMG_URL =
    "https://img.freepik.com/free-vector/creative-content-writing-copywriting-blogging-internet-marketing-article-text-editing-publishing-online-documents-writer-editor-character_335657-2622.jpg?w=740&t=st=1690015550~exp=1690016150~hmac=89f00c443cb5df4eba399f23125928222d393ea60a5369e02cfe2fd93f14c191";
const WELCOME_IMG_URL =
    "https://thumbs.dreamstime.com/b/obelisk-axum-rome-stele-tigray-region-ethiopia-s-vintage-engraving-old-engraved-illustration-163082957.jpg";
const IMP_IMG_URL =
    "https://img.freepik.com/free-vector/happy-woman-chatting-with-friends-online_74855-14073.jpg?w=740&t=st=1690029239~exp=1690029839~hmac=2b3691c97187857ab510ee5d439100191d1521af185a07cd1857ebe66973ab47";
const PROFILE_IMG_URL =
    "https://img.freepik.com/free-vector/profile-interface-concept-illustration_114360-3329.jpg?w=740&t=st=1690050976~exp=1690051576~hmac=678c647549b7bcb69a7ec0d221af928c67cb0cf742d7d9541ab4206609fdca76";
const UNCLAIMED_IMG_URL =
    "https://img.freepik.com/free-vector/character-illustration-people-with-networking-icon_53876-43083.jpg?w=740&t=st=1690137286~exp=1690137886~hmac=cd5a0fa3c565f12f35f282e681371a73131ca850905fa24815ab48be477108f7";

export function WikiIntro() {
    return (
        <Stack align="center">
            <Stack align="center" spacing={1}>
                <Title order={3}>⭐Welcome to TigrayWiki⭐</Title>
                <Text>A place for everything Tigray!</Text>
            </Stack>
            <Image
                src={WIKI_IMG_URL}
                width="20rem"
                height={200}
                alt="wiki_pic"
                fit="contain"
            />

            <Stack align="center" spacing={1}>
                <Title order={4}>📅 The Public Timeline</Title>
                <Text align="center">
                    The Public Timeline displays major events in a horizontal
                    scrollable timeline. It mainly focuses on Historical Events
                    of Tigray and the Tigray Genocide.
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>📕 Wiki Pages</Title>
                <Text align="center">
                    TigrayWiki Pages bring a reliable Tigrayan Knowledge Base
                    about Tigrayan Culture, History, Heroes, and more to the
                    internet and the world at large.
                </Text>
            </Stack>
        </Stack>
    );
}

export function ProfileIntro() {
    return (
        <Stack align="center">
            <Stack align="center" spacing={1}>
                <Title order={3}>⭐Welcome to TigrayWiki⭐</Title>
                <Text>A place for everything Tigray!</Text>
            </Stack>
            <Image
                src={PROFILE_IMG_URL}
                width="20rem"
                height={200}
                alt="wiki_pic"
                fit="contain"
            />
            <Stack align="center" spacing={1}>
                <Title order={4}>🧕 Your Profile</Title>
                <Text align="center">
                    Your profile page is where all your Life Events and Stories
                    live. Stories can be posted to your profile by your Family
                    Members
                </Text>
            </Stack>

            <Stack align="center" spacing={1}>
                <Title order={4}>🗓️ Events</Title>
                <Text align="center">
                    These are major life events like Birth, Graduation,
                    Marriage, Job Promotion, etc. posted on your profile by you
                    or your family members.
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>✏️ Written Stories</Title>
                <Text align="center">
                    Write down a memory of yours on your or a relative&apos;s
                    profile for the family to share.
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>🎤 Audio Stories</Title>
                <Text align="center">
                    Feel like your story would be better told with an audio?
                    Leave a voice note on your or a relative&apos;s profile for
                    the family to listen.
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>🗺️ Places</Title>
                <Text align="center">
                    The places page displays your and your family&apos;s Events
                    and Stories on a map.
                </Text>
            </Stack>
        </Stack>
    );
}

export function TreeIntro() {
    return (
        <Stack align="center">
            <Stack align="center" spacing={1}>
                <Title order={3}>⭐Welcome to TigrayWiki⭐</Title>
                <Text>A place for everything Tigray!</Text>
            </Stack>
            <Image
                src={FAM_IMG_URL}
                width="20rem"
                height={200}
                alt="wiki_pic"
                fit="contain"
            />
            <Stack align="center" spacing={1}>
                <Title order={4}>👨‍👩‍👦‍👦 Family Trees</Title>
                <Text align="center">
                    TigrayWiki Family Trees allow you to collaborate on building
                    your family tree and sharing your memories.
                </Text>
            </Stack>

            <Stack align="center" spacing={1}>
                <Title order={4}>
                    🔗 Tag Registered TigrayWiki Users to your trees
                </Title>
                <Text align="center">
                    After adding a node to your family tree, you can search for
                    and tag a Registered TigrayWiki User to that node.
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>🕰️ Family Tree Timeline</Title>
                <Text align="center">
                    Everytime you tag a user to your Family Tree, we will make a
                    compilation of all the Events, Written Stories, and Audio
                    Stories of you and your family in a scrollable vertical
                    Timeline. Scroll through your Family Tree Timeline and
                    relive your memories!
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>❔ Unclaimed Profiles</Title>
                <Text align="center">
                    Tagging a family member who&apos;s not a registered
                    TigrayWiki User to your tree? Go ahead and create an
                    &apos;Unclaimed Profile&apos; for them and we&apos;ll
                    automatically link their contents when they claim the
                    profile on signup.
                </Text>
            </Stack>
            <Stack align="center" spacing={1}>
                <Title order={4}>🛎️ Before you start building...</Title>
                <Text align="center">
                    After you&apos;ve entered your information on signup, make
                    sure you go through the list of suggested Unclaimed Profiles
                    that match your information. If you find an Unclaimed
                    Profile in your name, send the owner a &apos;claim
                    request&apos; and we&apos;ll link the Events, Stories, and
                    Trees to your account after your claim is approved.
                </Text>
            </Stack>
        </Stack>
    );
}

export function ImportanceIntro() {
    return (
        <Stack align="center">
            <Stack align="center" spacing={1}>
                <Title order={3}>⭐Welcome to TigrayWiki⭐</Title>
                <Text>A place for everything Tigray</Text>
            </Stack>
            <Image
                src={IMP_IMG_URL}
                width="20rem"
                height={200}
                alt="wiki_pic"
                fit="contain"
            />
            <Title order={4}>Why Do We Need TigrayWiki</Title>
        </Stack>
    );
}

export function Welcome() {
    return (
        <Stack align="center">
            <Image
                src={WELCOME_IMG_URL}
                width="20rem"
                height={300}
                alt="wiki_pic"
                fit="contain"
            />
            <Title order={2} align="center">
                Explore Your Heritage 🌱 Preserve Your History
            </Title>
        </Stack>
    );
}

export function UnclaimedProfilesHelp() {
    return (
        <Stack align="center">
            <Stack align="center" spacing={1}>
                <Title order={3}>❔ Unclaimed Profiles</Title>
            </Stack>
            <Image
                src={UNCLAIMED_IMG_URL}
                width="20rem"
                height={200}
                alt="wiki_pic"
                fit="contain"
            />
            <Text>
                When you want to add users to a family tree you&apos;ve built,
                you tag their profile to a node in your family tree.
            </Text>
            <Text>
                What happens if the person you&apos;re trying to tag to your
                family tree is not a registred user? You simply create an
                Unclaimed Profile in their name and tag it to your family tree.
            </Text>

            <Text>
                You and other family members can post Events, and Stories to the
                Unclaimed Profile you&apos;ve created and all contents will show
                up on your Family Tree Timeline.
            </Text>
            <Text>
                If the actual person signs up to TigrayWiki, they will have the
                option to send you a claim request to the Unclaimed Profile
                you&apos;ve created in their name. When you approve, all the
                contents of the Unclaimed Profile will be linked to their
                account and they will seamlessly be added to your family trees.
            </Text>
        </Stack>
    );
}
