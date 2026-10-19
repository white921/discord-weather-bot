-- Encrypted and international subdivision IDs can exceed the original width.
ALTER TABLE `UserFavorite`
    MODIFY `subdivisionId` VARCHAR(255) NOT NULL;
