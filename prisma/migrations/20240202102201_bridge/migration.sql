-- CreateTable
CREATE TABLE `author` (
    `user_id` VARCHAR(100) NOT NULL,
    `display_name` VARCHAR(30) NULL,
    `link_to` VARCHAR(1000) NULL,
    `selected_display` VARCHAR(20) NULL,
    `is_verified` BOOLEAN NULL,
    `will_receive_support_emails` BOOLEAN NULL,
    `gpt_total` INTEGER NULL,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `upt_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` VARCHAR(20) NOT NULL,
    `key` VARCHAR(40) NULL,
    `title` VARCHAR(30) NULL,
    `description` VARCHAR(100) NULL,
    `display_type` VARCHAR(10) NULL,
    `display_group` VARCHAR(30) NULL,
    `locale` VARCHAR(10) NULL,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `upt_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gizmo` (
    `id` VARCHAR(20) NOT NULL,
    `user_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(64) NULL,
    `image` TEXT NULL,
    `description` VARCHAR(300) NULL,
    `welcome_message` VARCHAR(400) NULL,
    `prompt_starters` TEXT NULL,
    `short_url` VARCHAR(100) NULL,
    `categories` VARCHAR(300) NULL,
    `updated_at` DATETIME(0) NOT NULL,
    `tags` VARCHAR(200) NULL,
    `tools` VARCHAR(300) NULL,
    `language` VARCHAR(30) NULL,
    `conversations` BIGINT NULL DEFAULT 0,
    `uv` BIGINT NULL DEFAULT 0,
    `pv` BIGINT NULL DEFAULT 0,
    `like` BIGINT NULL DEFAULT 0,
    `share` BIGINT NULL DEFAULT 0,
    `create_time` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `gizmo_user_id_index`(`user_id`),
    INDEX `gizmo_language_index`(`language`),
    INDEX `gizmo_conversations_index`(`conversations` DESC),
    INDEX `gizmo_create_time_index`(`create_time` DESC),
    INDEX `gizmo_like_index`(`like` DESC),
    INDEX `gizmo_pv_index`(`pv` DESC),
    INDEX `gizmo_share_index`(`share` DESC),
    INDEX `gizmo_updated_at_index`(`updated_at` DESC),
    INDEX `gizmo_uv_index`(`uv` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gizmo_metrics` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(100) NOT NULL,
    `gizmo_id` VARCHAR(20) NULL,
    `num_conversations_str` INTEGER NULL,
    `pv` INTEGER NOT NULL DEFAULT 0,
    `date` VARCHAR(10) NOT NULL,

    INDEX `gizmo_metrics_user_id_date_index`(`user_id`, `date`),
    UNIQUE INDEX `gizmo_metrics_gizmo_id_date_uindex`(`gizmo_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `language` (
    `id` VARCHAR(30) NOT NULL,
    `create_time` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
