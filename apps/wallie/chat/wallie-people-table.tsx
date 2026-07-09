"use client";

import React from "react";
import Image from "next/image";
import { Mail, SendHorizontal } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { FALLBACK_ICON_URL } from "@/lib/asset-urls";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  CardCRM as Card,
  CardContentCRM as CardContent,
} from "@/components/agentCRM/agentPeople/custom-ui/card-crm";
import { ApolloLead } from "../types";

const FALLBACK_AVATAR = FALLBACK_ICON_URL;
const APOLLO_LINKEDIN_DEFAULT_PHOTO_FRAGMENT =
  "static.licdn.com/aero-v1/sc/h/9c8pery4andzj6ohjkjp54ma2";

const COLUMN_WIDTHS = {
  name: 280,
  company: 200,
  actions: 168,
  title: 220,
} as const;

const ACTION_BUTTON_CLASS =
  "flex items-center justify-center w-8 h-8 rounded-lg border-[0.5px] border-solid border-neutral-200/80 bg-gray-50 shadow-none transition-colors duration-150 hover:border-neutral-300/80 hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.14)] cursor-pointer";

const TABLE_BORDER_CLASS = "border-[0.5px] border-neutral-200/80";
const TABLE_ROW_CLASS = `w-full rounded-none border-0 bg-gray-50 shadow-none ${TABLE_BORDER_CLASS} border-l-0 border-t-0 border-b border-r`;

export interface EnrichedPersonFromDb {
  id: string;
  apollo_person_id: string;
  first_name: string | null;
  last_name: string | null;
  title: string | null;
  photo_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  company_name: string | null;
}

interface WalliePeopleTableProps {
  people: ApolloLead[];
  enrichedPeopleMap: Record<string, EnrichedPersonFromDb>;
  enrichedIds: Set<string>;
  alreadyEnrichedIds: Set<string>;
  enrichingIds: Set<string>;
  imageErrorIds: Set<string>;
  onImageError: (personId: string) => void;
  onEnrich: (person: ApolloLead) => void;
  onEmailClick: (email: string, personId: string, e: React.MouseEvent) => void;
  onAddToSequence: (
    personId: string,
    personData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      company?: string;
    },
    e: React.MouseEvent
  ) => void;
}

function isDefaultLinkedInPhoto(url: string | null | undefined): boolean {
  return Boolean(url?.includes(APOLLO_LINKEDIN_DEFAULT_PHOTO_FRAGMENT));
}

function EnrichmentActionButton({
  isEnriching,
  onEnrich,
}: {
  isEnriching: boolean;
  onEnrich: (e: React.MouseEvent) => void;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={onEnrich}
          disabled={isEnriching}
          className={cn(
            "flex flex-col items-center justify-center gap-[2px] w-8 h-8 rounded-lg border-[0.5px] border-solid border-neutral-200/80 bg-gray-50 shadow-none transition-colors duration-150 hover:border-neutral-300/80 hover:shadow-[inset_0_4px_8px_rgba(0,0,0,0.14)] cursor-pointer",
            isEnriching && "animate-pulse"
          )}
        >
          {isEnriching ? (
            <>
              <div className="w-5 h-[3px] rounded-sm bg-blue-500" />
              <div className="w-4 h-[3px] rounded-sm bg-blue-400" />
              <div className="w-3 h-[3px] rounded-sm bg-blue-300" />
            </>
          ) : (
            <>
              <div className="w-5 h-[3px] rounded-sm bg-gray-300 opacity-30" />
              <div className="w-4 h-[3px] rounded-sm bg-gray-300 opacity-30" />
              <div className="w-3 h-[3px] rounded-sm bg-gray-300 opacity-30" />
            </>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent className="font-light" side="top" sideOffset={5}>
        {isEnriching ? "Enriching..." : "Add to database"}
      </TooltipContent>
    </Tooltip>
  );
}

function WalliePeopleTableHeader() {
  const headerLabelClass =
    "text-[11px] font-normal uppercase tracking-[0.16em] text-neutral-500";

  return (
    <Card className={`relative ${TABLE_ROW_CLASS} rounded-tl-lg overflow-hidden`}>
      <CardContent className="py-2 relative bg-gray-50">
        <div className="flex items-stretch">
          <div
            className={`flex items-center gap-4 flex-shrink-0 pr-0 self-stretch bg-gray-50 ${TABLE_BORDER_CLASS} border-l-0 border-t-0 border-b-0 border-r`}
            style={{ width: `${COLUMN_WIDTHS.name}px` }}
          >
            <div className="flex items-center gap-4 flex-1 py-2 pl-6 bg-gray-50 relative max-w-full">
              <div className="w-[40px]" />
              <h3 className={cn(headerLabelClass, "min-w-0")}>Name</h3>
            </div>
          </div>
          <div className="flex items-center min-w-0 flex-1">
            <div
              className="flex items-center flex-shrink-0 pl-6"
              style={{ width: `${COLUMN_WIDTHS.company}px` }}
            >
              <span className={cn(headerLabelClass, "pl-3 truncate")}>Company</span>
            </div>
            <div
              className="flex items-center flex-shrink-0"
              style={{ width: `${COLUMN_WIDTHS.actions}px` }}
            >
              <span className={cn(headerLabelClass, "truncate")}>Actions</span>
            </div>
            <div
              className="flex items-center flex-shrink-0 min-w-0"
              style={{ width: `${COLUMN_WIDTHS.title}px` }}
            >
              <span className={cn(headerLabelClass, "truncate")}>Title</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const WalliePeopleTableRow = React.memo(function WalliePeopleTableRow({
  person,
  dbPerson,
  isEnriched,
  isEnriching,
  photoUrl,
  displayName,
  onImageError,
  onEnrich,
  onEmailClick,
  onAddToSequence,
}: {
  person: ApolloLead;
  dbPerson?: EnrichedPersonFromDb;
  isEnriched: boolean;
  isEnriching: boolean;
  photoUrl: string;
  displayName: string;
  onImageError: () => void;
  onEnrich: (e: React.MouseEvent) => void;
  onEmailClick: (email: string, personId: string, e: React.MouseEvent) => void;
  onAddToSequence: (
    personId: string,
    personData: {
      firstName?: string;
      lastName?: string;
      email?: string;
      company?: string;
    },
    e: React.MouseEvent
  ) => void;
}) {
  const title = (dbPerson?.title ?? person.title) || "—";
  const company = (dbPerson?.company_name ?? person.companyName) || "—";
  const linkedinUrl = dbPerson?.linkedin_url ?? person.linkedinUrl;

  const nameContent = (
    <>
      <Image
        src={photoUrl}
        alt={`${displayName} profile`}
        width={40}
        height={40}
        loading="eager"
        sizes="40px"
        className={cn(
          "rounded-full object-cover aspect-square w-[40px] h-[40px] shrink-0",
          photoUrl === FALLBACK_AVATAR && "border border-neutral-200/80"
        )}
        onError={onImageError}
      />
      <p className="text-sm font-light text-foreground truncate w-full">{displayName}</p>
    </>
  );

  return (
    <div className="block relative w-full">
      <Card className={`${TABLE_ROW_CLASS} group relative overflow-hidden box-border`}>
        <CardContent className="py-3 relative z-10">
          <div className="flex items-stretch">
            <div
              className={`flex items-stretch gap-4 flex-shrink-0 pr-0 self-stretch bg-gray-50 ${TABLE_BORDER_CLASS} border-l-0 border-t-0 border-b-0 border-r`}
              style={{ width: `${COLUMN_WIDTHS.name}px` }}
            >
              <div className="flex items-center gap-4 flex-1 -my-3 py-3 pl-6 relative bg-gray-50 max-w-full min-h-full">
                {nameContent}
              </div>
            </div>

            <div className="flex items-center min-w-0 flex-1">
              <div
                className="flex items-center flex-shrink-0 pl-6 overflow-hidden"
                style={{ width: `${COLUMN_WIDTHS.company}px` }}
              >
                <p className="text-sm font-light text-foreground truncate w-full pl-3">
                  {company}
                </p>
              </div>

              <div
                className="flex items-center gap-2 flex-shrink-0 overflow-hidden"
                style={{ width: `${COLUMN_WIDTHS.actions}px` }}
              >
                {!isEnriched && (
                  <EnrichmentActionButton
                    isEnriching={isEnriching}
                    onEnrich={onEnrich}
                  />
                )}
                {dbPerson ? (
                  <div className="flex items-center gap-2">
                    {dbPerson.email && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => onEmailClick(dbPerson.email!, dbPerson.id, e)}
                            className={ACTION_BUTTON_CLASS}
                          >
                            <Mail className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5}>Send email</TooltipContent>
                      </Tooltip>
                    )}
                    {dbPerson.email && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) =>
                              onAddToSequence(
                                dbPerson.id,
                                {
                                  firstName: dbPerson.first_name ?? undefined,
                                  lastName: dbPerson.last_name ?? undefined,
                                  email: dbPerson.email ?? undefined,
                                  company: dbPerson.company_name ?? undefined,
                                },
                                e
                              )
                            }
                            className={ACTION_BUTTON_CLASS}
                          >
                            <SendHorizontal className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5}>Add to Sequence</TooltipContent>
                      </Tooltip>
                    )}
                    {dbPerson.linkedin_url && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={
                              dbPerson.linkedin_url.startsWith("http")
                                ? dbPerson.linkedin_url
                                : `https://linkedin.com/in/${dbPerson.linkedin_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={ACTION_BUTTON_CLASS}
                          >
                            <FaLinkedin className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5}>View LinkedIn</TooltipContent>
                      </Tooltip>
                    )}
                    {!dbPerson.email && !dbPerson.linkedin_url && (
                      <span className="text-sm font-light text-muted-foreground">—</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {person.email && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a href={`mailto:${person.email}`} className={ACTION_BUTTON_CLASS}>
                            <Mail className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5}>Send email</TooltipContent>
                      </Tooltip>
                    )}
                    {linkedinUrl && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={
                              linkedinUrl.startsWith("http")
                                ? linkedinUrl
                                : `https://linkedin.com/in/${linkedinUrl}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={ACTION_BUTTON_CLASS}
                          >
                            <FaLinkedin className="w-4 h-4 flex-shrink-0 text-neutral-500" />
                          </a>
                        </TooltipTrigger>
                        <TooltipContent side="top" sideOffset={5}>View LinkedIn</TooltipContent>
                      </Tooltip>
                    )}
                    {!person.email && !linkedinUrl && !isEnriched && (
                      <span className="sr-only">Enrich to unlock actions</span>
                    )}
                    {!person.email && !linkedinUrl && isEnriched && (
                      <span className="text-sm font-light text-muted-foreground">—</span>
                    )}
                  </div>
                )}
              </div>

              <div
                className="flex items-center flex-shrink-0 overflow-hidden min-w-0"
                style={{ width: `${COLUMN_WIDTHS.title}px` }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm font-light text-foreground truncate w-full cursor-default">
                      {title}
                    </p>
                  </TooltipTrigger>
                  {title !== "—" && (
                    <TooltipContent side="top" sideOffset={5}>
                      <p className="max-w-xs break-words">{title}</p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

export function WalliePeopleTable({
  people,
  enrichedPeopleMap,
  enrichedIds,
  alreadyEnrichedIds,
  enrichingIds,
  imageErrorIds,
  onImageError,
  onEnrich,
  onEmailClick,
  onAddToSequence,
}: WalliePeopleTableProps) {
  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-gray-700 mb-2">Contacts you can enrich</p>
      <TooltipProvider>
        <div className={`rounded-tl-lg ${TABLE_BORDER_CLASS}`}>
          <WalliePeopleTableHeader />
          <div className="flex flex-col bg-gray-50">
          {people.map((person) => {
            const dbPerson = enrichedPeopleMap[person.id];
            const isEnriched = enrichedIds.has(person.id) || alreadyEnrichedIds.has(person.id);
            const isEnriching = enrichingIds.has(person.id);
            const displayName = dbPerson
              ? [dbPerson.first_name, dbPerson.last_name].filter(Boolean).join(" ").trim() || "Unknown"
              : [person.firstName, person.lastName].filter(Boolean).join(" ") || "Unknown";
            const photoFailed = imageErrorIds.has(person.id);
            const rawPhoto = dbPerson?.photo_url ?? person.photo;
            const photoUrl =
              !photoFailed && rawPhoto && !isDefaultLinkedInPhoto(rawPhoto)
                ? rawPhoto
                : FALLBACK_AVATAR;

            return (
              <WalliePeopleTableRow
                key={person.id}
                person={person}
                dbPerson={dbPerson}
                isEnriched={isEnriched}
                isEnriching={isEnriching}
                photoUrl={photoUrl}
                displayName={displayName}
                onImageError={() => onImageError(person.id)}
                onEnrich={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (isEnriched || isEnriching) return;
                  onEnrich(person);
                }}
                onEmailClick={onEmailClick}
                onAddToSequence={onAddToSequence}
              />
            );
          })}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}
