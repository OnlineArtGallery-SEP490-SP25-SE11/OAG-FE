'use client';

import { Exhibition, ExhibitionStatus } from "@/types/exhibition";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Rocket, Save, RefreshCcw, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ExhibitionInfoHeader } from "../../components/exhibition-info-header";
import ExhibitionPublishStatus from "./exhibition-publish-status";
import { LoaderButton } from "@/components/ui.custom/loader-button";
import { useExhibition } from "../../../context/exhibition-provider";

// Define operation types for tracking specific loading states
type UpdateOperation = 'linkName' | 'publish' | 'unpublish' | 'discovery';

const formSchema = z.object({
    linkName: z.string()
        .min(3, { message: 'Link name must be at least 3 characters long' })
        .max(30, { message: 'Link name must be less than 30 characters' })
        .regex(/^[a-z0-9-]+$/, {
            message: 'Link name can only contain lowercase letters, numbers, and hyphens'
        }),
    isDiscoverable: z.boolean().default(false)
});

type FormValues = z.infer<typeof formSchema>;

export default function PublishContent({ exhibition }: { exhibition: Exhibition }) {
    const t = useTranslations('exhibitions');
    const tCommon = useTranslations('common');
    const { toast } = useToast();
    const { updateExhibition, isUpdating } = useExhibition();
    const [isPublished, setIsPublished] = useState(exhibition.status === ExhibitionStatus.PUBLISHED);
    // Track operation-specific loading states
    const [currentOperation, setCurrentOperation] = useState<UpdateOperation | null>(null);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const baseUrl = 'oag-vault.vercel.app/exhibition/';

    // Initialize the form with exhibition data
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            linkName: exhibition.linkName || '',
            isDiscoverable: exhibition.discovery || false
        }
    });

    // Format the link name on input
    const handleLinkNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        form.setValue('linkName', formattedValue, {
            shouldValidate: true,
            shouldDirty: true
        });
    };

    // Handle link name reset
    const handleLinkNameReset = () => {
        form.setValue('linkName', exhibition.linkName || '', {
            shouldValidate: true,
            shouldDirty: false
        });
    };

    // Handle link name save
    const handleLinkNameSave = async () => {
        const linkName = form.getValues('linkName');
        if (!linkName || linkError) return;

        setCurrentOperation('linkName');
        await updateExhibition({
            linkName
        }, {
            onSuccess: () => {
                toast({
                    title: tCommon('success'),
                    description: t('link_name_updated'),
                    variant: 'success',
                });
                form.reset({ ...form.getValues() });  // Reset form state but keep current values
                setCurrentOperation(null);
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: t('link_name_update_failed'),
                    variant: 'destructive',
                });
                setCurrentOperation(null);
            }
        });
    };

    // Handle unpublish
    const handleUnpublish = async () => {
        if (isUpdating && currentOperation) return;

        setCurrentOperation('unpublish');
        await updateExhibition({
            status: ExhibitionStatus.DRAFT
        }, {
            onSuccess: () => {
                setIsPublished(false);
                toast({
                    title: tCommon('success'),
                    description: t('exhibition_unpublished'),
                    variant: 'success',
                });
                setCurrentOperation(null);
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: t('unpublish_failed'),
                    variant: 'destructive',
                });
                setCurrentOperation(null);
            }
        });
    };

    // Handle discovery toggle with immediate update
    const handleDiscoveryToggle = async (checked: boolean) => {
        // Update the form state
        form.setValue('isDiscoverable', checked);

        // Only send the request if the exhibition is already published
        if (isPublished) {
            setCurrentOperation('discovery');
            await updateExhibition({
                discovery: checked
            }, {
                onSuccess: () => {
                    toast({
                        title: tCommon('success'),
                        description: t('discovery_updated'),
                        variant: 'success',
                    });
                    setCurrentOperation(null);
                },
                onError: () => {
                    // Revert the UI switch state on failure
                    form.setValue('isDiscoverable', !checked);
                    toast({
                        title: tCommon('error'),
                        description: t('discovery_update_failed'),
                        variant: 'destructive',
                    });
                    setCurrentOperation(null);
                }
            });
        }
    };

    // Submit handler for publishing the exhibition
    const onSubmit = async (data: FormValues) => {
        setCurrentOperation('publish');
        await updateExhibition({
            linkName: data.linkName,
            status: ExhibitionStatus.PUBLISHED
        }, {
            onSuccess: () => {
                setIsPublished(true);
                toast({
                    title: tCommon('success'),
                    description: t('exhibition_published'),
                    variant: 'success',
                });
                setCurrentOperation(null);
            },
            onError: () => {
                toast({
                    title: tCommon('error'),
                    description: t('publish_failed'),
                    variant: 'destructive',
                });
                setCurrentOperation(null);
            }
        });
    };

    const linkName = form.watch('linkName');
    const isDiscoverable = form.watch('isDiscoverable');
    const linkError = form.formState.errors.linkName?.message;
    const isLinkNameDirty = form.formState.dirtyFields.linkName === true;

    // Helper to check if a specific operation is in progress
    const isOperationLoading = (operation: UpdateOperation) => isUpdating && currentOperation === operation;

    return (
        <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
            <ExhibitionInfoHeader
                description="exhibition_publish_description"
                title="exhibition_publish_title"
            />
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card className="p-6">
                    <div className="mb-4">
                        <Label htmlFor="linkName" className="text-lg font-semibold">
                            {t('link_name')}
                        </Label>
                        <p className="text-sm text-gray-500 mb-2">
                            {t('link_name_description')}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-gray-500 whitespace-nowrap">
                            {baseUrl}
                        </span>
                        <Input
                            id="linkName"
                            {...form.register('linkName')}
                            onChange={handleLinkNameChange}
                            placeholder={t('enter_link_name')}
                            className={linkError ? 'border-destructive' : ''}
                            disabled={isOperationLoading('linkName')}
                        />
                    </div>

                    {linkError && (
                        <p className="text-sm text-destructive mt-1">{linkError}</p>
                    )}

                    {/* Save and Reset buttons for Link Name */}
                    {isPublished && (
                        <div className="flex gap-2 mt-4 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleLinkNameReset}
                                disabled={isOperationLoading('linkName') || !isLinkNameDirty}
                                className="gap-1"
                            >
                                <RefreshCcw className="w-4 h-4" />
                                {t('reset')}
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleLinkNameSave}
                                disabled={isOperationLoading('linkName') || !isLinkNameDirty || !!linkError || !linkName}
                                className="gap-1"
                            >
                                <Save className="w-4 h-4" />
                                {isOperationLoading('linkName') ? t('saving') : t('save_changes')}
                            </Button>
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <Label className="text-lg font-semibold">
                                {t('discoverable')}
                            </Label>
                            <p className="text-sm text-gray-500">
                                {t('discoverable_description')}
                            </p>
                        </div>
                        <Switch
                            checked={isDiscoverable}
                            onCheckedChange={handleDiscoveryToggle}
                            id="isDiscoverable"
                            disabled={isOperationLoading('discovery') || !isPublished}
                        />
                    </div>
                    {!isPublished && (
                        <p className="text-sm text-amber-600 mt-2">
                            {t('discovery_publish_first')}
                        </p>
                    )}
                </Card>

                <ExhibitionPublishStatus
                    isPublished={isPublished}
                    linkName={linkName}
                    baseUrl={baseUrl}
                />

                <div className="flex justify-end pt-4">
                    {/* Unpublish button - only show if already published */}
                    {isPublished && (
                        <Button
                            type="button"
                            size="lg"
                            variant="outline"
                            onClick={handleUnpublish}
                            disabled={isOperationLoading('unpublish')}
                            className="gap-2 border-destructive text-destructive hover:bg-destructive/10"
                        >
                            <EyeOff className="w-5 h-5" />
                            {isOperationLoading('unpublish') ? t('unpublishing') : t('unpublish')}
                        </Button>
                    )}

                    {/* Only show publish button if not published */}
                    {!isPublished && <div>
                        <LoaderButton
                            isLoading={isOperationLoading('publish')}
                            type="submit"
                            size="lg"
                            disabled={!linkName || !!linkError || isOperationLoading('publish')}
                            className="gap-2"
                        >
                            <Rocket className="w-5 h-5" />
                            {t('publish_exhibition')}
                        </LoaderButton>
                    </div>}
                </div>
            </form>
        </div>
    );
}