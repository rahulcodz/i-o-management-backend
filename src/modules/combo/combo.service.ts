import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryRoleComboDto } from './dto/query-role-combo.dto';
import { QueryUserComboDto } from './dto/query-user-combo.dto';
import { QueryOrganizationComboDto } from './dto/query-organization-combo.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ComboService {
    constructor(private prisma: PrismaService) { }

    async getUsersCombo(currentUser: any, query: QueryUserComboDto) {
        if (!currentUser || !currentUser.userId) {
            throw new ForbiddenException('Invalid user context');
        }

        // Get current user's role to check if Super Admin
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        // Build where clause
        const where: Prisma.UserWhereInput = {};

        // If not Super Admin, filter by organization
        if (currentUserRole?.name !== 'Super Admin') {
            // Use organizationId from JWT payload, or fetch from database if not available
            let organizationId = currentUser.organizationId;

            // If organizationId is not in JWT, fetch it from database
            if (!organizationId) {
                const user = await this.prisma.user.findUnique({
                    where: { id: currentUser.userId },
                    select: { organizationId: true },
                });

                if (!user || !user.organizationId) {
                    throw new ForbiddenException('Organization not found for user');
                }
                organizationId = user.organizationId;
            }
            where.organizationId = organizationId;
        }

        // Add search filter if provided
        if (query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        // Fetch all users in the same organization, include role data and id/name
        const users = await this.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            }
        });

        // Return users with id, label and role information for combo
        return users.map(u => ({
            id: u.id,
            label: u.name,
        }));
    }

    async getRolesCombo(query: QueryRoleComboDto) {
        // Build where clause for search
        const where: Prisma.RoleWhereInput = {};

        if (query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        // Optimized query: select only roleId and roleName
        const roles = await this.prisma.role.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            },
        });

        // Transform to return only roleId and roleName
        return roles.map(role => ({
            roleId: role.id,
            roleName: role.name,
        }));
    }

    async getOrganizationsCombo(currentUser: any, query: QueryOrganizationComboDto) {
        if (!currentUser || !currentUser.userId) {
            throw new ForbiddenException('Invalid user context');
        }

        // Get current user's role to check if Super Admin
        const currentUserRole = await this.prisma.role.findUnique({
            where: { id: currentUser.roleId },
            select: { name: true },
        });

        // Build where clause
        const where: Prisma.OrganizationWhereInput = {};

        // If not Super Admin, filter by user's organization
        if (currentUserRole?.name !== 'Super Admin') {
            // Use organizationId from JWT payload, or fetch from database if not available
            let organizationId = currentUser.organizationId;

            // If organizationId is not in JWT, fetch it from database
            if (!organizationId) {
                const user = await this.prisma.user.findUnique({
                    where: { id: currentUser.userId },
                    select: { organizationId: true },
                });

                if (!user || !user.organizationId) {
                    throw new ForbiddenException('Organization not found for user');
                }
                organizationId = user.organizationId;
            }
            where.id = organizationId;
        }

        // Add search filter if provided
        if (query.search) {
            where.name = {
                contains: query.search,
                mode: 'insensitive',
            };
        }

        // Fetch organizations
        const organizations = await this.prisma.organization.findMany({
            where,
            select: {
                id: true,
                name: true,
            },
            orderBy: {
                name: 'asc',
            }
        });

        // Return organizations with id and name for combo
        return organizations.map(org => ({
            id: org.id,
            label: org.name,
        }));
    }

    async getCountriesCombo(query?: { search?: string }) {
        const countries = [
            { id: "AFG", label: "Afghanistan" },
            { id: "ALB", label: "Albania" },
            { id: "DZA", label: "Algeria" },
            { id: "AND", label: "Andorra" },
            { id: "AGO", label: "Angola" },
            { id: "ATG", label: "Antigua and Barbuda" },
            { id: "ARG", label: "Argentina" },
            { id: "ARM", label: "Armenia" },
            { id: "AUS", label: "Australia" },
            { id: "AUT", label: "Austria" },
            { id: "AZE", label: "Azerbaijan" },
            { id: "BHS", label: "Bahamas" },
            { id: "BHR", label: "Bahrain" },
            { id: "BGD", label: "Bangladesh" },
            { id: "BRB", label: "Barbados" },
            { id: "BLR", label: "Belarus" },
            { id: "BEL", label: "Belgium" },
            { id: "BLZ", label: "Belize" },
            { id: "BEN", label: "Benin" },
            { id: "BTN", label: "Bhutan" },
            { id: "BOL", label: "Bolivia" },
            { id: "BIH", label: "Bosnia and Herzegovina" },
            { id: "BWA", label: "Botswana" },
            { id: "BRA", label: "Brazil" },
            { id: "BRN", label: "Brunei" },
            { id: "BGR", label: "Bulgaria" },
            { id: "BFA", label: "Burkina Faso" },
            { id: "BDI", label: "Burundi" },
            { id: "CPV", label: "Cabo Verde" },
            { id: "KHM", label: "Cambodia" },
            { id: "CMR", label: "Cameroon" },
            { id: "CAN", label: "Canada" },
            { id: "CAF", label: "Central African Republic" },
            { id: "TCD", label: "Chad" },
            { id: "CHL", label: "Chile" },
            { id: "CHN", label: "China" },
            { id: "COL", label: "Colombia" },
            { id: "COM", label: "Comoros" },
            { id: "COG", label: "Congo (Congo-Brazzaville)" },
            { id: "COD", label: "Congo (Democratic Republic of the)" },
            { id: "CRI", label: "Costa Rica" },
            { id: "HRV", label: "Croatia" },
            { id: "CUB", label: "Cuba" },
            { id: "CYP", label: "Cyprus" },
            { id: "CZE", label: "Czechia (Czech Republic)" },
            { id: "DNK", label: "Denmark" },
            { id: "DJI", label: "Djibouti" },
            { id: "DMA", label: "Dominica" },
            { id: "DOM", label: "Dominican Republic" },
            { id: "ECU", label: "Ecuador" },
            { id: "EGY", label: "Egypt" },
            { id: "SLV", label: "El Salvador" },
            { id: "GNQ", label: "Equatorial Guinea" },
            { id: "ERI", label: "Eritrea" },
            { id: "EST", label: "Estonia" },
            { id: "SWZ", label: "Eswatini (fmr. Swaziland)" },
            { id: "ETH", label: "Ethiopia" },
            { id: "FJI", label: "Fiji" },
            { id: "FIN", label: "Finland" },
            { id: "FRA", label: "France" },
            { id: "GAB", label: "Gabon" },
            { id: "GMB", label: "Gambia" },
            { id: "GEO", label: "Georgia" },
            { id: "DEU", label: "Germany" },
            { id: "GHA", label: "Ghana" },
            { id: "GRC", label: "Greece" },
            { id: "GRD", label: "Grenada" },
            { id: "GTM", label: "Guatemala" },
            { id: "GIN", label: "Guinea" },
            { id: "GNB", label: "Guinea-Bissau" },
            { id: "GUY", label: "Guyana" },
            { id: "HTI", label: "Haiti" },
            { id: "VAT", label: "Holy See" },
            { id: "HND", label: "Honduras" },
            { id: "HUN", label: "Hungary" },
            { id: "ISL", label: "Iceland" },
            { id: "IND", label: "India" },
            { id: "IDN", label: "Indonesia" },
            { id: "IRN", label: "Iran" },
            { id: "IRQ", label: "Iraq" },
            { id: "IRL", label: "Ireland" },
            { id: "ISR", label: "Israel" },
            { id: "ITA", label: "Italy" },
            { id: "JAM", label: "Jamaica" },
            { id: "JPN", label: "Japan" },
            { id: "JOR", label: "Jordan" },
            { id: "KAZ", label: "Kazakhstan" },
            { id: "KEN", label: "Kenya" },
            { id: "KIR", label: "Kiribati" },
            { id: "KOR", label: "Korea (South)" },
            { id: "PRK", label: "Korea (North)" },
            { id: "XKX", label: "Kosovo" },
            { id: "KWT", label: "Kuwait" },
            { id: "KGZ", label: "Kyrgyzstan" },
            { id: "LAO", label: "Laos" },
            { id: "LVA", label: "Latvia" },
            { id: "LBN", label: "Lebanon" },
            { id: "LSO", label: "Lesotho" },
            { id: "LBR", label: "Liberia" },
            { id: "LBY", label: "Libya" },
            { id: "LIE", label: "Liechtenstein" },
            { id: "LTU", label: "Lithuania" },
            { id: "LUX", label: "Luxembourg" },
            { id: "MDG", label: "Madagascar" },
            { id: "MWI", label: "Malawi" },
            { id: "MYS", label: "Malaysia" },
            { id: "MDV", label: "Maldives" },
            { id: "MLI", label: "Mali" },
            { id: "MLT", label: "Malta" },
            { id: "MHL", label: "Marshall Islands" },
            { id: "MRT", label: "Mauritania" },
            { id: "MUS", label: "Mauritius" },
            { id: "MEX", label: "Mexico" },
            { id: "FSM", label: "Micronesia" },
            { id: "MDA", label: "Moldova" },
            { id: "MCO", label: "Monaco" },
            { id: "MNG", label: "Mongolia" },
            { id: "MNE", label: "Montenegro" },
            { id: "MAR", label: "Morocco" },
            { id: "MOZ", label: "Mozambique" },
            { id: "MMR", label: "Myanmar (formerly Burma)" },
            { id: "NAM", label: "Namibia" },
            { id: "NRU", label: "Nauru" },
            { id: "NPL", label: "Nepal" },
            { id: "NLD", label: "Netherlands" },
            { id: "NZL", label: "New Zealand" },
            { id: "NIC", label: "Nicaragua" },
            { id: "NER", label: "Niger" },
            { id: "NGA", label: "Nigeria" },
            { id: "MKD", label: "North Macedonia" },
            { id: "NOR", label: "Norway" },
            { id: "OMN", label: "Oman" },
            { id: "PAK", label: "Pakistan" },
            { id: "PLW", label: "Palau" },
            { id: "PSE", label: "Palestine State" },
            { id: "PAN", label: "Panama" },
            { id: "PNG", label: "Papua New Guinea" },
            { id: "PRY", label: "Paraguay" },
            { id: "PER", label: "Peru" },
            { id: " PHL", label: "Philippines" },
            { id: "POL", label: "Poland" },
            { id: "PRT", label: "Portugal" },
            { id: "QAT", label: "Qatar" },
            { id: "ROU", label: "Romania" },
            { id: "RUS", label: "Russia" },
            { id: "RWA", label: "Rwanda" },
            { id: "KNA", label: "Saint Kitts and Nevis" },
            { id: "LCA", label: "Saint Lucia" },
            { id: "VCT", label: "Saint Vincent and the Grenadines" },
            { id: "WSM", label: "Samoa" },
            { id: "SMR", label: "San Marino" },
            { id: "STP", label: "Sao Tome and Principe" },
            { id: "SAU", label: "Saudi Arabia" },
            { id: "SEN", label: "Senegal" },
            { id: "SRB", label: "Serbia" },
            { id: "SYC", label: "Seychelles" },
            { id: "SLE", label: "Sierra Leone" },
            { id: "SGP", label: "Singapore" },
            { id: "SVK", label: "Slovakia" },
            { id: "SVN", label: "Slovenia" },
            { id: "SLB", label: "Solomon Islands" },
            { id: "SOM", label: "Somalia" },
            { id: "ZAF", label: "South Africa" },
            { id: "SSD", label: "South Sudan" },
            { id: "ESP", label: "Spain" },
            { id: "LKA", label: "Sri Lanka" },
            { id: "SDN", label: "Sudan" },
            { id: "SUR", label: "Suriname" },
            { id: "SWE", label: "Sweden" },
            { id: "CHE", label: "Switzerland" },
            { id: "SYR", label: "Syria" },
            { id: "TWN", label: "Taiwan" },
            { id: "TJK", label: "Tajikistan" },
            { id: "TZA", label: "Tanzania" },
            { id: "THA", label: "Thailand" },
            { id: "TLS", label: "Timor-Leste" },
            { id: "TGO", label: "Togo" },
            { id: "TON", label: "Tonga" },
            { id: "TTO", label: "Trinidad and Tobago" },
            { id: "TUN", label: "Tunisia" },
            { id: "TUR", label: "Turkey" },
            { id: "TKM", label: "Turkmenistan" },
            { id: "TUV", label: "Tuvalu" },
            { id: "UGA", label: "Uganda" },
            { id: "UKR", label: "Ukraine" },
            { id: "ARE", label: "United Arab Emirates" },
            { id: "GBR", label: "United Kingdom" },
            { id: "USA", label: "United States of America" },
            { id: "URY", label: "Uruguay" },
            { id: "UZB", label: "Uzbekistan" },
            { id: "VUT", label: "Vanuatu" },
            { id: "VEN", label: "Venezuela" },
            { id: "VNM", label: "Vietnam" },
            { id: "YEM", label: "Yemen" },
            { id: "ZMB", label: "Zambia" },
            { id: "ZWE", label: "Zimbabwe" }
        ];

        if (query?.search) {
            const searchTerm = query.search.toLowerCase();
            return countries.filter(c =>
                c.label.toLowerCase().includes(searchTerm) ||
                c.id.toLowerCase().includes(searchTerm)
            );
        }

        return countries;
    }
}
