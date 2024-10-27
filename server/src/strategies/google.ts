import {PrismaClient} from '@prisma/client';
import passport from "passport";
const prisma = new PrismaClient();
dotenv.config({path: __dirname + '/.env'});
import {type Profile, Strategy as GoogleStrategy, type VerifyCallback} from 'passport-google-oauth20';
import dotenv from "dotenv";
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'GOOGLE_CLIENT_ID';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'GOOGLE_CLIENT_SECRET';
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL || 'GOOGLE_CALLBACK_URL';

passport.use(<passport.Strategy>new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
        scope: ['profile', 'email']
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback ) => {
        console.log({accessToken});
        console.log({email: profile.emails});
        let email: string | undefined;
        if(profile.emails !== undefined)
        {
            email = profile.emails[0].value;
            console.log(email);

            const user = await prisma.user.count({
                where: {
                    username: email
                }
            });

            if(user === 0)
            {
                await prisma.user.create({
                    data: {
                        username: email,
                        password: 'google',
                        status: 'online'
                    }
                });
            }
        }
        done(null, {username: profile.displayName, email: email});
    }
));