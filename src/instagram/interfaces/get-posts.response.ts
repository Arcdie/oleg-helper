export interface IGetPostsResponse {
  data: {
    xdt_api__v1__feed__user_timeline_graphql_connection: {
      edges: Array<{
        node: {
          code: string;
          pk: string;
          id: string;
          ad_id: '';
          boosted_status: '';
          boost_unavailable_identifier: '';
          boost_unavailable_reason: '';
          caption: {
            has_translation: '';
            created_at: number;
            pk: string;
            text: string;
          };
          caption_is_edited: boolean;
          feed_demotion_control: '';
          feed_recs_demotion_control: '';
          taken_at: number;
          inventory_source: '';
          video_versions: '';
          is_dash_eligible: '';
          number_of_qualities: '';
          video_dash_manifest: '';
          image_versions2: {
            candidates: Array<{
              url: string;
              height: number;
              width: number;
            }>;
          };
          is_paid_partnership: boolean;
          sponsor_tags: '';
          affiliate_info: '';
          original_height: number;
          original_width: number;
          organic_tracking_token: string;
          link: '';
          story_cta: '';
          user: {
            pk: string;
            username: string;
            profile_pic_url: string;
            is_private: boolean;
            is_embeds_disabled: '';
            is_unpublished: boolean;
            is_verified: boolean;
            friendship_status: '';
            latest_besties_reel_media: '';
            latest_reel_media: '';
            live_broadcast_visibility: '';
            live_broadcast_id: '';
            group_metadata: '';
            seen: '';
            supervision_info: '';
            id: string;
            __typename: string;
          };
          group: '';
          owner: {
            pk: string;
            profile_pic_url: string;
            username: string;
            friendship_status: '';
            group_metadata: '';
            is_embeds_disabled: '';
            is_unpublished: boolean;
            is_verified: boolean;
            show_account_transparency_details: boolean;
            supervision_info: '';
            transparency_product: '';
            transparency_product_enabled: boolean;
            transparency_label: '';
            id: string;
            is_private: boolean;
            full_name: string;
          };
          coauthor_producers: '';
          follow_hashtag_info: '';
          title: '';
          comment_count: number;
          comments_disabled: '';
          commenting_disabled_for_viewer: '';
          like_and_view_counts_disabled: boolean;
          has_liked: boolean;
          top_likers: '';
          facepile_top_likers: '';
          like_count: number;
          preview: '';
          can_see_insights_as_brand: boolean;
          social_context: '';
          view_count: '';
          can_reshare: '';
          can_viewer_reshare: boolean;
          ig_media_sharing_disabled: boolean;
          photo_of_you: boolean;
          product_type: string;
          media_type: number;
          usertags: '';
          media_overlay_info: '';
          carousel_parent_id: '';
          carousel_media_count?: number;
          carousel_media?: Array<{
            id: string;
            pk: string;
            accessibility_caption: '';
            is_dash_eligible: '';
            video_dash_manifest: '';
            media_type: number;
            original_height: number;
            original_width: number;
            inventory_source: '';
            user: '';
            usertags: '';
            image_versions2: {
              candidates: Array<{
                url: string;
                height: number;
                width: number;
              }>;
            };
            carousel_parent_id: string;
            sharing_friction_info: {
              bloks_app_url: '';
              should_have_sharing_friction: boolean;
            };
            preview?: string;
            organic_tracking_token: '';
            saved_collection_ids: '';
            has_viewer_saved: '';
            video_versions: '';
            media_overlay_info: '';
            number_of_qualities: '';
            link: '';
            story_cta: '';
            carousel_media: '';
          }>;
          location: '';
          has_audio: '';
          clips_metadata: '';
          clips_attribution_info: '';
          accessibility_caption: '';
          audience: '';
          saved_collection_ids: '';
          has_viewer_saved: '';
          expiring_at: '';
          sharing_friction_info: {
            should_have_sharing_friction: boolean;
            bloks_app_url: '';
          };
          comments: Array<''>;
          media_cropping_info: '';
          thumbnails: '';
          timeline_pinned_user_ids: '';
          upcoming_event: '';
          explore: '';
          main_feed_carousel_starting_media_id: '';
          is_seen: '';
          __typename: string;
        };
        cursor: string;
      }>;
      page_info: {
        end_cursor: string;
        has_next_page: boolean;
        has_previous_page: boolean;
        start_cursor: '';
      };
    };
    xdt_viewer: {
      user: '';
    };
  };
  extensions: {
    is_final: boolean;
  };
}
