const pool = require('../config/db');
const {errorModel, sendServerError} = require("../utility/errorMessages");

const userHasResourcePermission = async (userId, permissionName, resourceType, resourceId) => {
    try {
        const users = await pool.query(`
            SELECT 1
            FROM permissions p
            WHERE p.name = 'write'
              AND (
                EXISTS (
                    SELECT 1 FROM access_control ac
                    WHERE ac.user_id = ${userId}
                      AND ac.resource_type = ${resourceType}
                      AND ac.resource_id = ${resourceId}
                      AND ac.permission_id = p.id
                )
                    OR EXISTS (
                    SELECT 1
                    FROM group_memberships gm
                             JOIN resource_groups rg ON rg.group_id = gm.group_id
                             JOIN group_role_permissions grp
                                  ON grp.group_id = gm.group_id AND grp.role_id = gm.role_id
                    WHERE gm.user_id = 5
                      AND rg.resource_type = ${resourceType}
                      AND rg.resource_id = ${resourceId}
                      AND grp.resource_type = ${resourceType}
                      AND grp.permission_id = p.id
                )
                )
        `);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        sendServerError(res, errorModel.GENERAL);
    }
}

const groupHasResourcePermission = async(userId, permissionName, resourceType, resourceId) => {
    try {
        const users = await pool.query(`
            SELECT 1
            FROM permissions p
            WHERE p.name = ${permissionName}
              AND (
                EXISTS (
                    SELECT 1
                    FROM group_memberships gm
                             JOIN resource_groups rg ON rg.group_id = gm.group_id
                             JOIN group_role_permissions grp
                                  ON grp.group_id = gm.group_id AND grp.role_id = gm.role_id
                    WHERE gm.user_id = ${userId}
                      AND rg.resource_type = ${resourceType}
                      AND rg.resource_id = ${resourceId}
                      AND grp.resource_type = ${resourceType}
                      AND grp.permission_id = p.id
                )
            )
        `);
        res.json(users.rows);
    } catch (err) {
        console.error(err.message);
        sendServerError(res, errorModel.GENERAL);
    }
}